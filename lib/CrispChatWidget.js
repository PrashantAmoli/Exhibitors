import React, { Component } from 'react';
import { Crisp } from 'crisp-sdk-web';

class CrispChat extends Component {
	componentDidMount() {
		Crisp.configure('9d5d716b-62e9-4c59-8ece-9eee4132bf02');
	}

	render() {
		return null;
	}
}
export default CrispChat;
