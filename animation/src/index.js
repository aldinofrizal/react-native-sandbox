import React , { useState } from 'react'
import { Dimensions ,View, StyleSheet, Text } from 'react-native'
import Animated , { Easing } from 'react-native-reanimated'
import { TapGestureHandler, State } from 'react-native-gesture-handler'
import Svg , { Image , Circle , ClipPath} from 'react-native-svg'

const { Value , event , block, cond, eq, set, Clock, startClock, stopClock, debug, timing, clockRunning, interpolate, Extrapolate} = Animated
const { width , height } = Dimensions.get('window')

export default NetflixClone = () => {
    const [buttonOpacity] = useState(new Value(1))


    const onStateChange = event([
        {
            nativeEvent : ({ state }) => block([
                cond(eq(state, State.END), set(buttonOpacity, runTiming(new Clock() , 1, 0) ))
            ])
        }
    ])  

    const buttonY = interpolate(buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [100, 0],
        extrapolate: Extrapolate.CLAMP
    })

    const bgY = interpolate(buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [-height / 1.2 , 0],
        extrapolate: Extrapolate.CLAMP
    })
    
    return (
        <View style={{ flex : 1 , backgroundColor : 'white', justifyContent : 'flex-end'}}>
            <Animated.View style={{...StyleSheet.absoluteFill, transform : [{translateY : bgY}] }}>
                <Svg height={'150%'} width={width}>
                    <ClipPath id="clip">
                        <Circle r={height} cx={width/2} />
                    </ClipPath>
                    <Image 
                        href={require('../assets/bg.jpeg')}
                        width={'100%'}
                        height={'130%'}
                        preserveAspectRatio="xMidYmid slice"
                        clipPath="url(#clip)"
                    />
                </Svg>
            </Animated.View>
            <View style={{ height : height/3 , justifyContent : 'flex-end'}}>
                <TapGestureHandler
                    onHandlerStateChange={onStateChange}
                    >
                    <Animated.View style={{...styles.button, opacity : buttonOpacity , transform : [{ translateY : buttonY }] }}>
                        <Text style={{ fontSize : 20, fontWeight : 'bold'}}>START</Text>
                    </Animated.View>
                </TapGestureHandler>
            </View>
        </View>
    )

    function runTiming(clock, value, dest) {
        const state = {
          finished: new Value(0),
          position: new Value(0),
          time: new Value(0),
          frameTime: new Value(0)
        };
      
        const config = {
          duration: 1000,
          toValue: new Value(0),
          easing: Easing.inOut(Easing.ease)
        };
      
        return block([
          cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, dest),
            startClock(clock)
          ]),
          timing(clock, state, config),
          cond(state.finished, debug('stop clock', stopClock(clock))),
          state.position
        ]);
      }
}

const styles = StyleSheet.create({
    button : {
        backgroundColor : 'white',
        height : 50,
        borderRadius : 35,
        marginHorizontal : 40,
        alignItems : 'center',
        justifyContent : 'center',
        marginVertical : 20
    }
})