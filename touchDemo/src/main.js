import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from 'react-native';

import iconAdd from './images/add.png';
import iconSetting from './images/setting.png';
import iconEmail from './images/email.png';
import iconPerson from './images/person.png';
import iconAttach from './images/attach.png';

import ActionButtonItem from './ActionButtonItem'
class CircleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: false,
      position:'lefts',
    };

    this.rotateAnimated = new Animated.Value(0);
    this.scaleAnimated = new Animated.Value(0);
    this.bringToLeftAnimated = new Animated.Value(0);
    this.bringToRightAnimated = new Animated.Value(0);
    this.fadeAnimated = new Animated.Value(0);

  }

  createAnimation(obj, toValue, duration, startFunc=()=>{}) {
    return Animated.timing(obj, {
      toValue,
      duration,
    }).start(startFunc());
  }


  startAnimation() {
    this.createAnimation(this.rotateAnimated, 1, 200);
    this.createAnimation(this.scaleAnimated, 1, 200);
    this.createAnimation(this.bringToLeftAnimated, 1, 200);
    this.createAnimation(this.bringToRightAnimated, 1, 200);
    this.createAnimation(this.fadeAnimated, 1, 200);
  }

  endAnimation() {
    this.createAnimation(this.rotateAnimated, 2, 200);
    this.createAnimation(this.scaleAnimated, 0, 200);
    this.createAnimation(this.bringToLeftAnimated, 0, 200);
    this.createAnimation(this.bringToRightAnimated, 0, 200);
    this.createAnimation(this.fadeAnimated, 0, 200);

  }

  _buttonCenter =()=>{
    this.startAnimation();
    this.setState({isClicked: !this.state.isClicked});

    if (this.state.isClicked) this.endAnimation();
  }


  _buttonRight= ()=>{
    this.setState({isClicked: !this.state.isClicked});
    this.endAnimation();
    this.props.onPressButtonRight();
  }

  _buttonClick= ()=>{

    this.setState({isClicked: !this.state.isClicked});
    this.endAnimation();
    //this.props.onPressButtonLeft();
  }

  render() {
    const {size, primaryColor, secondaryColor,children} = this.props;

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
      },
      buttonWrapper: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          position:'absolute',
          left:0
      },
      buttonLeft: {
        alignItems: 'center',
        justifyContent: 'center',
        width: size - 5,
        height: size - 5,
        //borderRadius: 360,
      },
      buttonRight: {
        alignItems: 'center',
        justifyContent: 'center',
        width: size - 5,
        height: size - 5,
        borderRadius: 360,
      },
      buttonCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 360,
        backgroundColor: primaryColor,
      },
      centerImage: {
        width: size - 5,
        height: size - 5,
      },

      childImage: {
        width: size - 15,
        height: size - 15,
      },

      circle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderRadius: 160,
        backgroundColor: secondaryColor,
        //flex:1
      },
    });

    const rotateMe = this.rotateAnimated.interpolate({
      inputRange: [0, 1, 2],
      outputRange: ['0deg', '45deg', '0deg'],
     });

    const scaleMeHeight = this.scaleAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [size, size],
    });

    const scaleMeWidth = this.scaleAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [size, size*(this.props.buttons.length+1)],
    });

    const bringMeToLeft = this.bringToLeftAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -this.props.buttons.length*size-10],
    });

    const bringMeToRight= this.bringToRightAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 10],
    });



    return (
      <View style={[styles.container,{alignItems:this.state.position==='left'?"flex-end":"flex-start"}, {

      }]}>
          <Animated.View style={[styles.circle,{left: this.state.position==='left'?bringMeToLeft:bringMeToRight,width:scaleMeWidth, height: scaleMeHeight}]}>
              <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 160,
              }}>

                  {
                      this.props.buttons &&this.state.isClicked&& this.props.buttons.map((item,i)=>this.CreateBtns(item,i))
                  }

              </View>


          </Animated.View>

          <Animated.View
              style={[styles.buttonWrapper, {transform: [{rotate: rotateMe}]}]}>
              <TouchableOpacity
                  onPress={this._buttonCenter}
                  activeOpacity={1}
                  style={styles.buttonCenter}>
                  <Animated.Image
                      source={this.props.iconButtonCenter}
                      style={styles.centerImage}
                  />
              </TouchableOpacity>
          </Animated.View>
      </View>
    );
  }

    CreateBtns(item,i){
        const fadeInOut = this.fadeAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        });
        return <ActionButtonItem key={i} size={this.props.size-15} width= {this.props.size-5} onClick={this._buttonClick} item={item} opacity={fadeInOut}/>
    }
}

class CreateButton extends Component {
    constructor(props) {
        super(props);
    }

    click = () => {
        this.props.onClick();
        if (this.props.item.onpress) {
            this.props.item.onpress()
        }
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this.click}
                activeOpacity={1}
                style={styles.buttonLeft}>
                <Animated.Image
                    source={this.props.iconButtonRight}
                    style={[styles.childImage, {opacity: this.props.opacity}]}
                />
            </TouchableOpacity>

        )
    }
}


CircleButton.defaultProps = {
  size: 40,
  iconButtonCenter: iconAdd,
  iconButtonTop: iconPerson,
  iconButtonRight: iconAttach,
  iconButtonBottom: iconSetting,
  iconButtonLeft: iconEmail,
  primaryColor: '#41727E',
  secondaryColor: '#459186',
  buttons:[],                  //底部按钮数组
};

CircleButton.propTypes = {
  size: PropTypes.number,
  iconButtonCenter: PropTypes.number,
  iconButtonTop: PropTypes.number,
  iconButtonRight: PropTypes.number,
  iconButtonBottom: PropTypes.number,
  iconButtonLeft: PropTypes.number,
  primaryColor: PropTypes.string,
  secondaryColor: PropTypes.string,
};

module.exports = CircleButton;
