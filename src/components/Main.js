require('normalize.css/normalize.css');
require('styles/App.less');
import React from 'react';

// 获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');
// 利用自执函数，将图片文件名转成图片url路径信息
imageDatas = (function getImgUrl(imageDataArr) {
  imageDataArr.forEach(item => {
    item.url = require('../images/' + item.name)
  })
  return imageDataArr;
})(imageDatas)

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec"></section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
