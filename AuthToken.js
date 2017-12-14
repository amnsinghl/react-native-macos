import React, {Component} from 'react';
import {AsyncStorage, Button, TextInput, View, Text, ActivityIndicator} from 'react-native';

export default class AuthToken extends Component {

    static navigationOptions = {
        title: 'Enter auth token'
    };

    constructor() {
        super();
        this.state = {
            token: "",
            guid: "", isLoading: true, isDone: false
        };
        AsyncStorage.getItem("token").then((v) => {
            if (v) {
                this.setState({
                    isLoading: false,
                    isDone: true
                })
            } else {
                this.setState({
                    isLoading: false,
                    isDone: false
                })
            }
        });
    }

    async saveToken() {
        await AsyncStorage.setItem("token", this.state.token);
        await AsyncStorage.setItem("guid", this.state.guid);
        this.props.navigation("MyTodos")
    }

    async clearData() {
        await AsyncStorage.clear();
    }

    render() {
        const {navigate} = this.props.navigation;
        // if (this.state.isLoading) {
        //     return (
        //         <View style={{flex: 1, paddingTop: 20}}>
        //             <ActivityIndicator/>
        //         </View>
        //     );
        // }
        // if (this.state.isDone) {
        //     navigate('MyTodos');
        //     return <View/>
        // }
        return (
            <View>
                <Text>Enter guid</Text>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({guid: text})}
                    value={this.state.guid}
                />
                <Text>Enter authtoken</Text>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({token: text})}
                    value={this.state.token}
                />
                <Button title="Save" color="#00c955" onPress={this.saveToken.bind(this)}/>
                <Button title="Clear data" color="#00c955" onPress={this.clearData.bind(this)}/>
            </View>
        );
    }
}
