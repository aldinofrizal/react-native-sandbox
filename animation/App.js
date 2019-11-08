import React,  { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Asset } from 'expo-asset'
import { AppLoading } from 'expo'
import NetflixClone from './src/index'

export default function App() {
  const [isReady , setIsReady] = useState(false)

  function cacheImages(images) {
    return images.map(image => {
      if (typeof image === 'string') {
        return Image.prefetch(image);
      } else {
        return Asset.fromModule(image).downloadAsync();
      }
    });
  }

  const _loadAssetsAsync = async () => {
    const imageAssets = cacheImages([
      require('./assets/bg.jpeg'),
    ]);
    await Promise.all([...imageAssets]);
  }

  if(isReady){
    return(
      <AppLoading
        startAsync={loadAssetsAsync}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    )
  }else {
    return(
      <NetflixClone />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
