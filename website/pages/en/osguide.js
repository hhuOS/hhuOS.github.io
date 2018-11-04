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
                <video width="560" height="420" loop autoPlay>
                    <source src={this.props.videosrc} type="video/webm"/>
                    Your browser does not support the video tag.
                </video>
                <h3>{this.props.description}</h3>
            </div>

        );
    }
}

class OSGuide extends React.Component {
    render() {
        return (
            <Container>
                <h2 style={{fontWeight: 'bold'}}>These videos should provide a quick introduction to hhuOS:</h2>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '18px 0px'}}
                     className="pluginWrapper">
                    <div>
                        <Video videosrc={videoUrl('shell.webm')} description={'The hhuOS-Shell'}/>
                    </div>
                    <div>
                        <Video videosrc={videoUrl('game.webm')} description={'Our demo game "Bug Defender"'}/>
                    </div>
                    <div>
                        <Video videosrc={videoUrl('mouse.webm')} description={'hhuOS has support for PS2-compatible mice'}/>
                    </div>
                </div>
            </Container>
        );
    }
}

module.exports = OSGuide;

