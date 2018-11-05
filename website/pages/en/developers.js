const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const Container = CompLibrary.Container;

const siteConfig = require(process.cwd() + '/siteConfig.js');

function imgUrl(img) {
    return siteConfig.baseUrl + 'img/' + img;
}

const Developer = props => (
    <div>
        <h2>{props.title}</h2>
        <p>{props.content}</p>
        <img src={this.image}/>
    </div>
);

class DeveloperGrid extends React.Component {

    renderContributor(contributor) {
        var githubDiv = "";
        if(contributor.github) {
            githubDiv =
                <div style={{alignItems: "center", justifyContent: "center", margin: 10}}>
                    <a href={contributor.github}>
                        <img src={imgUrl("github.svg")} style={{verticalAlign: "middle"}}/>
                    </a>
                </div>;
        }

        return (
            <div style={{display: 'inline-block', margin: 20}}>
                <p style={{fontWeight: 'bold'}}>{contributor.name}</p>
                <p>{contributor.topic}</p>
                {githubDiv}
            </div>
        );
    }

    renderContributors() {
        if(this.props.contributor) {
            return(
                <div className="container">
                    <h2 style={{fontWeight: 'bold'}}>Contributors</h2>
                    <p>There are contributor.</p>

                    <div className="showcaseSection">
                        {this.props.contributor.map(this.renderContributor, this)}
                    </div>
                </div>
            );

        } else {
            return(
                <div className="container">
                    <h2 style={{fontWeight: 'bold'}}>Contributors</h2>
                    <p>No contributor so far.</p>
                </div>
            );
        }
    }

    renderDeveloper(dev) {
        return (
            <div style={{display: 'inline-block', margin: 20}}>
                <p style={{fontWeight: 'bold'}}>{dev.name}</p>
                <p>{dev.type}</p>
                <img style={{width: 128}} src={dev.image}/>

                <div style={{alignItems: "center", justifyContent: "center", margin: 10}}>
                    <a href={dev.github}>
                        <img src={imgUrl("github.svg")} style={{verticalAlign: "middle"}}/>
                    </a>
                    <a href={"mailto:" + dev.email + "?subject=hhuOS"}>
                        <img src={imgUrl("message.png")} style={{verticalAlign: "middle"}}/>
                    </a>
                </div>
            </div>
        );
    }

    renderDevelopers() {
        return (
            <div className="container">
                <h2 style={{fontWeight: 'bold'}}>Team</h2>
                <p>hhuOS is being developed by a team of students at the Heinrich-Heine University in Düsseldorf.</p>

                <div className="showcaseSection">
                    {this.props.team.map(this.renderDeveloper, this)}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderDevelopers()}
                {this.renderContributors()}
            </div>
        );
    }
}

class Developers extends React.Component {
    render() {
        return (
            <Container className="wrapper" padding={["top", "left", "bottom", "right"]}>
                <DeveloperGrid
                    team={siteConfig.team}
                    contributor={siteConfig.contributor}
                />
            </Container>
        );
    }
}

module.exports = Developers;

