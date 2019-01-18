require('normalize.css/normalize.css');
require('styles/App.less');
import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');
// 利用自执函数，将图片文件名转成图片url路径信息
imageDatas = (function getImgUrl(imageDataArr) {
  imageDataArr.forEach(item => {
    item.url = require('../images/' + item.name)
  })
  return imageDataArr;
})(imageDatas)
/*
* 获取区间内的一个随机值
 */
function getRangeRandom (low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}
/*
* 获取0-30之间的任意一个正负值
 */
function get30DegRandom () {
  return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30))
}

class ImgFigure extends React.Component {
  handleClick = e => {
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  };
  render() {
    let styleObj = {};
    // 如果prop属性指定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos
    }
    // 如果prop属性指定了这张图片的旋转角度且不为0，则使用
    if (this.props.arrange.rotate) {
      const arr = ['MozTransform', 'msTransform', 'WebkitTransform', 'OTransform', 'transform']
      arr.forEach(item => {
        styleObj[item] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      })
    }
    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.url} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class AppComponent extends React.Component {
  constructor() {
    super();
    this.constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: { // 水平方向的取值范围
        leftSecX: [0,0],
        rightSecX: [0,0],
        y: [0,0]
      },
      vPosRange: { // 垂直方向的取值范围
        topY: [0,0],
        x: [0,0]
      }
    };
    this.state = {
      imgsArrangeArr: [
        // {
        //   pos: {
        //     left: '0',
        //     top: '0'
        //   },
        //   rotate: 0, // 旋转角度
        //   isInverse: false, // 旋转角度
        //   isCenter: false, // 图片是否居中
        // }
      ]
    };
  }
  /*
  * 翻转图片
  * @param index 输入当前被执行翻转操作的图片信息数组的索引值
  * @return {function}这是一个闭包函数，其内return一个真正待被执行的函数
  */
  inverse = index => {
    return () => {
      this.setState(() => {
        let imgsArrangeArr = Object.assign([], this.state.imgsArrangeArr);
        imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
        return {imgsArrangeArr: imgsArrangeArr};
      });
    };
  }
  /*
   * 利用rearrange函数，居中对应index的图片
   * @param index 需要被居中图片的index
   * @returns {function}
  */
  center = index => {
    return () => {
      this.rearrange(index);
    };
  }
  /*
  * 重新布局所有图片
  * @param centetIndex 指定居中排布那个图片
  */
  rearrange = centerIndex => {
    let imgsArrangeArr = this.state.imgsArrangeArr,
      constant = this.constant,
      centerPos = constant.centerPos,
      hPosRange = constant.hPosRange,
      vPosRange = constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTop = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      imgsArrangeTopArr = [], // 保存放到顶部区域的图片
      topImgNumber = Math.ceil(Math.random() * 2),  // 取一个或者不取
      topImgSpliceIndex = 0, // 布局顶部区域图片在数组中的索引值
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1); // 保存放到居中区域的图片
      // 居中centerIndex的图片
      imgsArrangeCenterArr[0] =  {
        pos: centerPos,
        rotate: 0,
        isCenter: true
      };
      // 取出布局在上测的图片的状态信息
      topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNumber));
      imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNumber);
      // 布局位于上部的图片
      imgsArrangeTopArr.forEach(item => {
        imgsArrangeTopArr[item] = {
          pos: {
            top: getRangeRandom(vPosRangeTop[0], vPosRangeTop[1]),
            left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
          },
          rotate: get30DegRandom(),
          isCenter: false
        }
      })
    //布局左右两侧的图片
    for(let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
      let hPosRangeLORX = null;
      //前半部分布局左边，右半部分布局右边
      if(i < k){
        hPosRangeLORX = hPosRangeLeftSecX;
      }else{
        hPosRangeLORX = hPosRangeRightSecX;
      }
      imgsArrangeArr[i]={
        pos : {
          top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    }
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }
  componentDidMount() {
    // 首先拿到舞台的大小
    let stageDom = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW/2),
        halfStageH = Math.ceil(stageH/2);
    // 获取imgFigure大小
    // let imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
        // imgW = imgFigureDom.scrollWidth,
        // imgH = imgFigureDom.scrollHeight,
    let imgW = 290,
        imgH = 400,
        halfImgW = Math.ceil(imgW/2),
        halfImgH = Math.ceil(imgH/2);
    // 计算中心位置
    this.constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }
    // 计算左侧、右侧区域图片排布位置的取值范围
    this.constant.hPosRange.leftSecX[0] = - halfImgW;
    this.constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.constant.hPosRange.y[0] = - halfImgH;
    this.constant.hPosRange.y[1] = stageH - halfImgH;
    // 计算上侧区域图片排布位置的取值范围
    this.constant.vPosRange.topY[0] = - halfImgH;
    this.constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.constant.vPosRange.x[0] = halfImgW - imgW;
    this.constant.vPosRange.x[1] = halfImgW;
    this.rearrange(0);
  }
  // 组件加载以后，为每张图片计算位置范围
  render() {
    let controllerUnits = [];
    let imgFigures = [];
    imageDatas.forEach((item, index) => {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImgFigure data={item} key={index} ref={'imgFigure'+ index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>)
    })
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
