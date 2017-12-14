import React, {Component} from 'react';
import {ActivityIndicator, Button, Image, ListView, StyleSheet, Text, View} from 'react-native';
import {StackNavigator} from "react-navigation";
import MyTodos from "./MyTodos";
import FlockAuth from "./FlockAuth";
import CreateTodo from "./CreateTodo";
import WebViewExample from "./WebViewExample";
import AuthToken from "./AuthToken";

const baseUrl = "https://apps.flock.co/todo/v2/";
const token = "flockEvent=%7B%22name%22%3A%22client.pressButton%22%2C%22button%22%3A%22appLauncherButton%22%2C%22chatName%22%3A%22Aman%20Singhal%22%2C%22chat%22%3A%22u%3A10104fr1oryrf0r0%22%2C%22userName%22%3A%22Aman%20Singhal%22%2C%22locale%22%3A%22en-us%22%2C%22userId%22%3A%22u%3Aisgpwwyralhf9aso%22%7D&flockEventToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHBJZCI6IjZkMGFhMzdiMDA5NDRlYzBhNzQyNmQzNGNhMmRmMDQ4IiwidXNlcklkIjoidTppc2dwd3d5cmFsaGY5YXNvIiwiZXhwIjoxNTEyOTY4OTA3LCJpYXQiOjE1MTIzNjQxMDcsImp0aSI6IjcwNjA5YmU2LWYzMzQtNGIzMS04Zjg1LWFjMzkwYTUyN2I2NiJ9.JCEurA8H_Uik3BN1ck4jp2gtAgYBIhP3KP-sbh4UK6I";

class Roster extends Component {

    constructor() {
        super();
        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
        const url = "https://apps.flock.co/todo/v2/roster?flockEvent=%7B%22name%22%3A%22client.pressButton%22%2C%22button%22%3A%22appLauncherButton%22%2C%22chatName%22%3A%22Droid%20Bakar%22%2C%22chat%22%3A%22g%3A01c3d65f4b5e4d4da08d7e5001c2372a%22%2C%22userName%22%3A%22Aman%20Singhal%22%2C%22locale%22%3A%22en-us%22%2C%22userId%22%3A%22u%3Aisgpwwyralhf9aso%22%7D&flockEventToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHBJZCI6IjZkMGFhMzdiMDA5NDRlYzBhNzQyNmQzNGNhMmRmMDQ4IiwidXNlcklkIjoidTppc2dwd3d5cmFsaGY5YXNvIiwiZXhwIjoxNTEzNzQzODE1LCJpYXQiOjE1MTMxMzkwMTUsImp0aSI6ImM2YWRkMTg1LWFiMTAtNDg0ZS04OGIzLTk5N2E5N2U0NGE5YiJ9.6FHks-AOpjjrsUo1FJi6l-VSm-MICd10EoJgEq9p_CM";
        // return fetch(baseUrl + 'roster?' + token)
        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({
                    isLoading: false,
                    dataSource: ds.cloneWithRows(responseJson.sort((a, b) => a.chatName < b.chatName)),
                }, function () {
                    // do something with new state
                });
            })
            .catch((error) => {
                console.error(error);
            });
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
                <Button title="My Todos" color="#00c955" onPress={() => navigate('MyTodos')}/>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) =>
                        <View style={{flex: 1, flexDirection: 'row', height: 50}}>
                            <Image source={{uri: rowData.chatProfileImage}}
                                   style={{width: 50, height: 50}}/>
                            <Text style={{
                                alignSelf: 'center',
                                fontSize: 20,
                                textAlign: 'center'
                            }}>{rowData.chatName}</Text>
                        </View>
                    }
                />
            </View>
        );
    }
}

const NavigationApp = StackNavigator({
    HWW: {screen: AuthToken},
    FlockAuth: {screen: FlockAuth},
    MyTodos: {screen: MyTodos},
    Roster: {screen: Roster},
    CreateTodo: {screen: CreateTodo}
});

export default class App extends Component {
    render() {
        return <NavigationApp/>;
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
