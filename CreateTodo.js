import React, {Component} from 'react';
import {Button, TextInput, View, AsyncStorage} from 'react-native';

const baseUrl = "https://apps.flock.co/todo/v2/";

export default class CreateTodo extends Component {

    static navigationOptions = {
        title: 'Create To-Do'
    };

    constructor() {
        super();
        this.state = {
            text: ""
        }
    }

    async addTodo() {
        const token = await AsyncStorage.getItem("todoToken");
        const url = baseUrl + "chat/" + this.props.state.chatId + "/list/" + this.props.state.listId + "/todo?" + token;
        // fetch()
    }

    render() {
        return (
            <View>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                />
                <Button title="Add todo" color="#00c955" onPress={this.addTodo.bind(this)}/>
            </View>
        );
    }
}
