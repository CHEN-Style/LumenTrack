import { useEffect, useState } from "react"
import { useTheme } from 'styled-components';

import './welcomePage.css';
import styled from 'styled-components';
import { useMode } from '../contexts/modeContext';
import zhCN from '../locales/zh-CN';
import enUS from '../locales/en-US';
import { useNavigate } from "react-router-dom";

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
  display: flex;
  justify-content: center;
  align-items: center;
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
  transition: all 0.3s ease;
`

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  width: 100%;
  max-width: 1200px;
`

const Card = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    
    ${IconContainer} {
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(57, 62, 70, 0.3);
    }
  }
`

const CardContent = styled.div`
  margin-left: 16px;
  flex: 1;
`

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0 0 8px 0;
  line-height: 1.2;
`

const CardDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.secondaryText};
  margin: 0;
  line-height: 1.4;
  opacity: 0.8;
`

export default function WelcomePage() {
  const theme = useTheme()
  const { mode, toggleMode, language, toggleLanguage } = useMode();
  const text = language === 'zh-CN' ? zhCN : enUS;
  const navigate = useNavigate();
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
        <CardsContainer>
          <Card onClick={() => navigate('/todo')}>
            <IconContainer>
              <TodoListIcon width={30} height={30} fill={theme.background} />
            </IconContainer>
            <CardContent>
              <CardTitle>{text.todoTitle}</CardTitle>
              <CardDescription>{text.todoDescription}</CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <IconContainer>
              <TodoListIcon width={30} height={30} fill={theme.background} />
            </IconContainer>
            <CardContent>
              <CardTitle>{text.moodTitle}</CardTitle>
              <CardDescription>{text.moodDescription}</CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <IconContainer>
              <TodoListIcon width={30} height={30} fill={theme.background} />
            </IconContainer>
            <CardContent>
              <CardTitle>{text.noteTitle}</CardTitle>
              <CardDescription>{text.noteDescription}</CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <IconContainer>
              <TodoListIcon width={30} height={30} fill={theme.background} />
            </IconContainer>
            <CardContent>
              <CardTitle>{text.analyticsTitle}</CardTitle>
              <CardDescription>{text.analyticsDescription}</CardDescription>
            </CardContent>
          </Card>
        </CardsContainer>
      </Nav>
      <Footer> </Footer>
    </WelcomePageContainer>
  )
}