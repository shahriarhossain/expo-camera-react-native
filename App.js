import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Container, Content, Icon } from 'native-base';
import { Camera, Permissions } from 'expo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class App extends React.Component {
	state = {
		hasCameraPermission: null, //Permission value
		type: Camera.Constants.Type.back, //specifying app start with back camera.
		file: null
	};

	async componentDidMount() {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({ hasCameraPermission: status === 'granted' });
	}

	takeSnap = async () => {
		if (this.camera) {
			let photo = await this.camera.takePictureAsync(); //this will capture the image in a temporary cache
			console.log(photo.uri);

			const time = new Date().getTime();
			const uriParts = photo.uri.split('.');
			const fileType = uriParts[uriParts.length - 1];
			const userID = 'shahriar';
			const newUri = `${Expo.FileSystem.documentDirectory}${userID}/${time}.${fileType}`;
			//storing the file
			Expo.FileSystem
				.copyAsync({
					from: photo.uri,
					to: newUri
				})
				.then(() => {
					alert('Photo saved in phone successfully.');
					console.log();
					this.setState({ file: newUri });
					console.log('Photo saved in phone');
				});
		}
	};

	render() {
		const { hasCameraPermission } = this.state;
		if (hasCameraPermission === null) {
			return <View />;
		} else if (hasCameraPermission === false) {
			return <Text>No access to camera</Text>;
		} else {
			return (
				<View style={{ flex: 1 }}>
					<Camera
						style={{ flex: 1 }}
						type={this.state.type}
						ref={(ref) => {
							this.camera = ref;
						}}
					>
						<View
							style={{
								flex: 1,
								flexDirection: 'column'
							}}
						>
							<TouchableOpacity
								style={{
									flex: 1,
									alignItems: 'flex-end',
									justifyContent: 'flex-start',
									marginTop: 30
								}}
								onPress={() => {
									this.setState({
										type:
											this.state.type === Camera.Constants.Type.back
												? Camera.Constants.Type.front
												: Camera.Constants.Type.back
									});
								}}
							>
								<MaterialCommunityIcons name="camera-rear" style={{ color: 'white', fontSize: 40 }} />
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									flex: 1,
									alignItems: 'center',
									justifyContent: 'flex-end'
								}}
								onPress={this.takeSnap}
							>
								<MaterialCommunityIcons
									name="circle-outline"
									style={{ color: 'white', fontSize: 80 }}
								/>
							</TouchableOpacity>
						</View>
					</Camera>
					<View>
						<Image
							source={{ uri: this.state.file }}
							style={{ height: 150, width: 200 }}
							resizeMode="contain"
						/>
					</View>
				</View>
			);
		}
	}
}
{
	/* <Icon name="ios-images" style={{ color: 'white', fontSize: 36 }} />  */
}
const styles = StyleSheet.create({
	content: {
		flex: 1,
		backgroundColor: '#9DD6EB',
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		fontSize: 30,
		fontWeight: 'bold',
		color: 'white'
	}
});
