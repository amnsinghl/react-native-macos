import React, {Component} from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    Button,
    FlatList,
    ListView,
    Text,
    View
} from 'react-native';
import CheckBox from "react-native-check-box";

const dikeUrl = "https://proxy.handler.talk.to/go.to/dike/v5.0/getAllAppsV2";
const baseUrl = "https://apps.flock.co/todo/v2/";

class TodoItem extends Component {

    //TODO: not working
    async markTodo() {
        const token = await AsyncStorage.getItem("todoToken");
        let url = baseUrl + "chat/" + this.props.chatId + "/list/" + this.props.listId + "/todo/" + this.props.state.todoId;
        if (this.props.checked) {
            url += "/open";
        } else {
            url += "/complete";
        }
        url += "?" + token;
        console.log(url);
        const response = (await fetch(url, {method: 'POST'}));
        console.log(response);
        if (response.ok) {
            this.prop.checked = !this.prop.checked;
            this.setState();
        }
    }

    render() {
        return (
            <View style={{padding: 10}}>
                <CheckBox
                    style={{flex: 1}}
                    onClick={this.markTodo.bind(this)}
                    isChecked={this.props.checked}
                    rightText={this.props.state.text}
                />
                <View
                    style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 33}}>
                    <Text>{this.props.state.assignedToName}</Text>
                    <Text>{this.props.state.dueOn}</Text>
                </View>
            </View>
        )
    }
}

class TodoList extends Component {

    constructor(props) {
        super(props);
    }

    async fetchCompletedTodos() {
        const token = await AsyncStorage.getItem("todoToken");
        const url = baseUrl + "chat/" + this.props.state.chatId + "/list/" + this.props.state.listId + "/completedtodos?" + token;
        console.log(url);
        const response = await ((await fetch(url)).json());
        this.props.state.completedTodos = response[this.props.state.listId].todos;
        this.setState({});
    }

    render() {
        return (
            <View style={{
                backgroundColor: 'white', marginLeft: 10, marginRight: 10, marginTop: 5,
                marginBottom: 5, padding: 10
            }}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>{this.props.state.listName}</Text>
                <View style={{flexDirection: 'row'}}>
                    <Text>in </Text>
                    <Text style={{color: '#00c955'}}>{this.props.state.chatName}</Text>
                </View>
                <FlatList
                    data={this.props.state.todos}
                    renderItem={({item}) =>
                        <TodoItem state={item} checked={false} listId={this.props.state.listId}
                                  chatId={this.props.state.chatId}/>
                    }
                    keyExtractor={item => item.todoId}
                />
                <FlatList
                    data={this.props.state.completedTodos}
                    renderItem={({item}) =>
                        <TodoItem state={item} checked={true}/>
                    }
                    keyExtractor={item => item.todoId}
                />
                <View
                    style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                    <Button title="Add a to-do"
                            color="#00c955" onPress={() => this.props.navigate('CreateTodo')}/>
                    <Button title="Show Completed"
                            color="#00c955" onPress={this.fetchCompletedTodos.bind(this)}/>
                </View>
            </View>
        );
    }
}

export default class MyTodos extends Component {

    static navigationOptions = {
        title: 'My To-Dos'
    };

    constructor() {
        super();
        this.state = {
            isLoading: true
        }
    }

    convertList(responseJson) {
        let ret = [];
        responseJson.chats.forEach((chat) => {
            let chatDetails = responseJson.roster.find((it) => it.chatId === chat.chatId);
            for (let li in chat.lists) {
                let todo = chat.lists[li];
                if (chatDetails) {
                    todo.chatName = chatDetails.chatName;
                } else {
                    todo.chatName = "";
                }
                todo.chatId = chat.chatId;
                ret.push(todo);
            }
        });
        return ret;
    }

    fetchTodos(todoToken) {
        const url = baseUrl + 'chat?' + todoToken;
        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({
                    isLoading: false,
                    dataSource: ds.cloneWithRows(this.convertList(responseJson)),
                }, function () {
                    // do something with new state
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async componentDidMount() {
        const todoToken = await AsyncStorage.getItem("todoToken");
        // const todoToken = "flockEvent=%7B\"name\"%3A\"client.pressButton\"%2C\"button\"%3A\"appLauncherButton\"%2C\"chatName\"%3A\"Droid%20Bakar\"%2C\"chat\"%3A\"g%3A01c3d65f4b5e4d4da08d7e5001c2372a\"%2C\"userName\"%3A\"Aman%20Singhal\"%2C\"locale\"%3A\"en-us\"%2C\"userId\"%3A\"u%3Aisgpwwyralhf9aso\"%7D&flockEventToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHBJZCI6IjZkMGFhMzdiMDA5NDRlYzBhNzQyNmQzNGNhMmRmMDQ4IiwidXNlcklkIjoidTppc2dwd3d5cmFsaGY5YXNvIiwiZXhwIjoxNTEzNzQzODE1LCJpYXQiOjE1MTMxMzkwMTUsImp0aSI6ImM2YWRkMTg1LWFiMTAtNDg0ZS04OGIzLTk5N2E5N2U0NGE5YiJ9.6FHks-AOpjjrsUo1FJi6l-VSm-MICd10EoJgEq9p_CM";
        if (todoToken) {
            this.fetchTodos(todoToken);
        } else {
            const guid = await AsyncStorage.getItem("guid");
            const token = await AsyncStorage.getItem("token");
            const url = dikeUrl + "?guid=" + guid + "&token=" + token;
            const response = await (await fetch(url)).json();
            const todoApp = response.apps.filter((it) => it.id === "6d0aa37b00944ec0a7426d34ca2df048")[0];
            await AsyncStorage.setItem("eventToken", todoApp.eventToken);
            await AsyncStorage.setItem("validationToken", todoApp.validationToken);
            const todoToken = "flockEvent=a&flockEventToken=" + todoApp.eventToken;
            await AsyncStorage.setItem("todoToken", todoToken);
            this.fetchTodos(todoToken);
        }
    }


    render() {
        const {navigate} = this.props.navigation;
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                    <ActivityIndicator/>
                </View>
            );
        }

        return (
            <View style={{flex: 1, paddingTop: 20}}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) =>
                        <TodoList state={rowData} navigate={navigate}/>
                    }
                />
            </View>
        );
    }
}
