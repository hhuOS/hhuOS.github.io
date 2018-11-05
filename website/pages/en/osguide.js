const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const Container = CompLibrary.Container;

const siteConfig = require(process.cwd() + '/siteConfig.js');

function videoUrl(img) {
    return siteConfig.baseUrl + 'video/' + img;
}

class Video extends React.Component {
    render() {
        return (
            <div>
                <h3><u>{this.props.description}:</u></h3>
                <video width="640" height="480" controls>
                    <source src={this.props.videosrc} type="video/webm"/>
                    Your browser does not support the video tag.
                </video>
            </div>

        );
    }
}

class OSGuide extends React.Component {
    render() {
        return (
            <Container>
                <h2 align="center" style={{fontWeight: 'bold'}}>These videos should provide a quick introduction to hhuOS:</h2>
                <div align="center" style={{display: 'block'}}
                     className="pluginWrapper">
                    <div>
                        <Video videosrc={videoUrl('shell.webm')} description={'The hhuOS-Shell'}/>
                    </div>
                    <div>
                        <Video videosrc={videoUrl('game.webm')} description={'Our demo game "Bug Defender"'}/>
                    </div>
                    <div>
                        <Video videosrc={videoUrl('mouse.webm')} description={'Mouse demo'}/>
                    </div>
                </div>
            </Container>
        );
    }
}

module.exports = OSGuide;

