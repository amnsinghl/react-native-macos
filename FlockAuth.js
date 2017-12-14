import React, {Component} from 'react';
import {ActivityIndicator, AsyncStorage, View, WebView, Text} from "react-native";

const WEBVIEW_REF = 'webview';
const DEFAULT_URL = 'https://m.facebook.com';
export default class FlockAuth extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            isDone: false,
            text: "hello",
            url: DEFAULT_URL,
            scalesPageToFit: true,
            status: 'No Page Loaded',
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            loading: true,
        };
    }

    componentDidMount() {
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

    getParameterByName(url, name) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    onNavigationStateChange(navState) {
        console.log(navState);
        const url = navState.url;
        this.setState({
            text: url + "kk"
        });
        if (this.getParameterByName(url, 'guid')) {
            const guid = this.getParameterByName(url, "guid");
            const authToken = this.getParameterByName(url, "auth_token");
            console.log("found " + guid + " " + authToken);
            AsyncStorage.setItem("guid", guid);
            AsyncStorage.setItem("token", authToken);
            this.setState({
                isLoading: false,
                isDone: true
            })
        }
    }


    render() {
        const {navigate} = this.props.navigation;
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                    <Text>{this.state.text}</Text>
                    <ActivityIndicator/>
                </View>
            );
        }
        if (this.state.isDone) {
            navigate('MyTodos');
            return <View/>
        }
        return (
            <View>
                <Text>{this.state.text}</Text>
                {/*<WebView*/}
                    {/*// source={{uri: 'https://auth.flock.com/login?redirect_uri=https://dev.flock.com'}}*/}
                    {/*source={{uri: 'https://www.google.com'}}*/}
                    {/*javaScriptEnabled={true}*/}
                    {/*domStorageEnabled={true}*/}
                    {/*startInLoadingState={true}*/}
                    {/*onNavigationStateChange={this.onNavigationStateChange.bind(this)}*/}
                {/*/>*/}
                <WebView
                    ref={WEBVIEW_REF}
                    automaticallyAdjustContentInsets={false}
                    // style={styles.webView}
                    source={{ uri: this.state.url }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    onNavigationStateChange={this.onNavigationStateChange}
                    onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                    startInLoadingState={true}
                    scalesPageToFit={this.state.scalesPageToFit}
                />
            </View>
        )
    }
}