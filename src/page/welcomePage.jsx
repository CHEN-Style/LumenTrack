import { useEffect, useState } from "react"
import { useTheme } from 'styled-components';

import './welcomePage.css';
import styled from 'styled-components';
import { useMode } from '../contexts/modeContext';
import zhCN from '../locales/zh-CN';
import enUS from '../locales/en-US';

import logo from '../assets/logoLight.png';
import welcomeImage from '../assets/welcomeImage.png';

import TodoListIcon from '../assets/svgs/todoList';


const WelcomePageContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.background};

  display: flex;
  flex-direction: column;
  align-items: center;
`

const Header = styled.header`
  width: 100%;
  height: 100px;
  padding: 0 80px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Main = styled.main`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: row;
`

const Nav = styled.nav`
  width: 100%;
  height: 260px;
  padding: 0 80px;
`

const Footer = styled.footer`
  width: 100%;
  height: 70px;
  padding: 0 80px;
`

const Article = styled.article`
  padding-left: 180px;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
`

const Display = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const WelcomeTitle = styled.h1`
  font-size: 48px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  
`

const WelcomeSubtitle = styled.h2`
  font-size: ${({ language }) => language === 'zh-CN' ? '24px' : '18px'};
  font-weight: 400;
  color: ${({ theme }) => theme.text};
`

const IconContainer = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #393E46;
`

export default function WelcomePage() {
  const theme = useTheme()
  const { mode, toggleMode, language, toggleLanguage } = useMode();
  const text = language === 'zh-CN' ? zhCN : enUS;

  return (
    <WelcomePageContainer>
      <Header>
        <img src={logo} style={{width: '250px', height: 'auto'}} alt="logo" />
        <div>
          <button onClick={toggleMode}>mode</button>
          <button onClick={toggleLanguage}>language</button>
        </div>
      </Header>
      <Main>
        <Article>
          <WelcomeTitle>{text.welcome}</WelcomeTitle>
          <WelcomeSubtitle language={language} style={{marginTop: '10px'}}>{text.subtitle1}</WelcomeSubtitle>
          <WelcomeSubtitle language={language}>{text.subtitle2}</WelcomeSubtitle>
          <WelcomeSubtitle language={language}>{text.subtitle3}</WelcomeSubtitle>
        </Article>
        <Display>
          <img src={welcomeImage} style={{width: '400px', height: 'auto'}} alt="welcomeImage" />
        </Display>
      </Main>
      <Nav>
        <div>
          <IconContainer>
            <TodoListIcon width={30} height={30} fill={theme.background} />
          </IconContainer>
        </div>
      </Nav>
      <Footer> </Footer>
    </WelcomePageContainer>
  )
}