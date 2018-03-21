/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const MarkdownBlock = CompLibrary.MarkdownBlock;
/* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

function imgUrl(img) {
    return siteConfig.baseUrl + 'img/' + img;
}

function docUrl(doc, language) {
    return siteConfig.baseUrl + 'docs/' + (language ? language + '/' : '') + doc;
}

function pageUrl(page, language) {
    return siteConfig.baseUrl + (language ? language + '/' : '') + page;
}

class Feature extends React.Component {
    render() {
        return (
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '18px 0px'}}
                 className="pluginWrapper">
                <div>
                    <h2>{this.props.title}</h2>
                    <p>{this.props.content}</p>
                </div>
                <div>
                    <img src={this.props.image}/>
                </div>
            </div>
        );
    }
}


class Button extends React.Component {
    render() {
        return (
            <div className="pluginWrapper buttonWrapper">
                <a className="button" href={this.props.href} target={this.props.target}>
                    {this.props.children}
                </a>
            </div>
        );
    }
}

Button.defaultProps = {
    target: '_self',
};

const SplashContainer = props => (
    <div className="homeContainer">
        <div className="homeSplashFade">
            <div className="wrapper homeWrapper">{props.children}</div>
        </div>
    </div>
);

const Logo = props => (
    <div className="projectLogo">
        <img src={props.img_src}/>
    </div>
);

const ProjectTitle = props => (
    <h2 className="projectTitle">
        {siteConfig.tagline}
    </h2>
);

const PromoSection = props => (
    <div className="section promoSection">
        <div className="promoRow">
            <div className="pluginRowBlock">{props.children}</div>
        </div>
    </div>
);

class HomeSplash extends React.Component {
    render() {
        let language = this.props.language || '';
        return (
            <SplashContainer>
                <img width='30%' src={imgUrl('logo.png')}/>
                <div className="inner">
                    <ProjectTitle/>
                    <PromoSection>
                        <Button href={docUrl('doc_overview.html')}>Documentation</Button>
                        <Button href={pageUrl('osguide.html')}>Video Guide</Button>
                        <Button href={siteConfig.repoUrl}>Contribute on Github</Button>
                    </PromoSection>
                </div>
            </SplashContainer>
        );
    }

    // TODO add Codedocumentation as Button to PromoSection
}

const Block = props => (
    <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock align="center" contents={props.children} layout={props.layout}/>
    </Container>
);

const Features = props => (
    <Container>
        <Feature title="Paging" content="Higher Half Kernel" image={imgUrl('paging_logo.svg')}/>
        <Feature title="Kernel Module Loader" content="It is possible to extend hhuOS with kernel modules."
                 image={imgUrl('module_loader.png')}/>
    </Container>
);

const FeatureCallout = props => (
    <div
        className="productShowcaseSection paddingBottom">
        <h2>Feature Callout</h2>
        <MarkdownBlock>These are a few features of this project</MarkdownBlock>
    </div>
);


const Description = props => (
    <Block>
        {[
            {
                content: 'hhuOS is a small operating system written in C++ and Assembler for x86-architectures.',
                image: imgUrl('sample_screenshot.png'),
                imageAlign: 'right',
                title: 'Description',
            },
        ]}
    </Block>
);

class Index extends React.Component {
    render() {
        let language = this.props.language || '';

        return (
            <div>
                <HomeSplash language={language}/>
                <div className="mainContainer">
                    <FeatureCallout/>
                    <Features/>
                    <Description/>
                </div>
            </div>
        );
    }
}

module.exports = Index;
