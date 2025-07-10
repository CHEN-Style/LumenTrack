import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from 'styled-components';
import { useMode } from '../contexts/modeContext';
import zhCN from '../locales/zh-CN';
import enUS from '../locales/en-US';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const Modal = styled.div`
  background: ${props => props.theme.cardBackground};
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 
    0 25px 80px rgba(0, 0, 0, 0.4),
    0 10px 30px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  animation: ${slideIn} 0.3s ease-out;
  border: 1px solid ${props => props.theme.secondaryText}15;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 32px 32px 0 32px;
  position: relative;
  background: linear-gradient(135deg, ${props => props.theme.cardBackground} 0%, ${props => props.theme.background}20 100%);
  border-bottom: 1px solid ${props => props.theme.secondaryText}10;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: ${props => props.theme.secondaryText}10;
  border: none;
  font-size: 20px;
  color: ${props => props.theme.secondaryText};
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 300;

  &:hover {
    background: ${props => props.theme.secondaryText}20;
    color: ${props => props.theme.text};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Content = styled.div`
  padding: 32px;
  overflow-y: auto;
  max-height: calc(90vh - 120px);
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.secondaryText}30;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.secondaryText}50;
  }
`;

const Title = styled.h2`
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.text};
  background: linear-gradient(135deg, ${props => props.theme.text} 0%, ${props => props.theme.secondaryText} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  margin: 0 0 24px 0;
  font-size: 14px;
  color: ${props => props.theme.secondaryText};
  font-weight: 400;
`;

const FormGroup = styled.div`
  margin-bottom: 28px;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 12px;
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 15px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 30px;
    height: 2px;
    background: linear-gradient(90deg, #3498db, #2980b9);
    border-radius: 1px;
  }
`;

const Input = styled.input`
  width: 95%;
  padding: 16px 20px;
  border: 2px solid ${props => props.theme.secondaryText}25;
  border-radius: 12px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 4px 20px rgba(52, 152, 219, 0.15);
    transform: translateY(-2px);
  }
  
  &::placeholder {
    color: ${props => props.theme.secondaryText}80;
  }
`;

const Textarea = styled.textarea`
  width: 95%;
  padding: 16px 20px;
  border: 2px solid ${props => props.theme.secondaryText}25;
  border-radius: 12px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 15px;
  min-height: 80px;
  resize: vertical;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 4px 20px rgba(52, 152, 219, 0.15);
    transform: translateY(-2px);
  }
  
  &::placeholder {
    color: ${props => props.theme.secondaryText}80;
  }
`;

const StepsSection = styled.div`
  margin-top: 20px;
  padding: 20px;
  border-radius: 16px;
  background: ${props => props.theme.background}50;
  border: 1px solid ${props => props.theme.secondaryText}15;
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 12px;
  background: ${props => props.completed ? '#27ae6015' : props.theme.cardBackground};
  border: 2px solid ${props => props.completed ? '#27ae6030' : props.theme.secondaryText + '15'};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const StepNumber = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.completed ? '#27ae60' : props.theme.secondaryText + '30'};
  color: ${props => props.completed ? 'white' : props.theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  flex-shrink: 0;
`;

const StepCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin: 0;
  accent-color: #27ae60;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const StepInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.secondaryText}25;
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.secondaryText}70;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid ${props => props.theme.secondaryText}15;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${props => props.theme.secondaryText}40, transparent);
  }
`;

const MainButtons = styled.div`
  display: flex;
  gap: 16px;
`;

const Button = styled.button`
  flex: 1;
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }

  ${props => props.primary ? `
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
    
    &:hover {
      background: linear-gradient(135deg, #2980b9, #1f5582);
      transform: translateY(-3px);
      box-shadow: 0 6px 25px rgba(52, 152, 219, 0.4);
    }
  ` : `
    background: ${props.theme.background};
    color: ${props.theme.secondaryText};
    border: 2px solid ${props.theme.secondaryText}25;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    &:hover {
      background: ${props.theme.secondaryText}10;
      border-color: ${props.theme.secondaryText}40;
      color: ${props.theme.text};
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

// 删除确认弹窗样式
const DeleteConfirmOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: ${fadeIn} 0.2s ease-out;
`;

const DeleteConfirmModal = styled.div`
  background: ${props => props.theme.cardBackground};
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid ${props => props.theme.secondaryText}20;
  animation: ${slideIn} 0.2s ease-out;
`;

const DeleteConfirmTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #e74c3c;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '⚠️';
    font-size: 20px;
  }
`;

const DeleteConfirmMessage = styled.p`
  margin: 0 0 24px 0;
  color: ${props => props.theme.text};
  line-height: 1.5;
  font-size: 14px;
`;

const DeleteConfirmButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const DeleteButton = styled.button`
  flex: 1;
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    background: linear-gradient(135deg, #c0392b, #a93226);
    transform: translateY(-3px);
    box-shadow: 0 6px 25px rgba(231, 76, 60, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default function TaskDetailModal({ task, isOpen, onClose, onSave }) {
  const theme = useTheme();
  const { language } = useMode();
  const t = language === 'zh-CN' ? zhCN : enUS;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    deadline: '',
    steps: [
      { text: '', done: false },
      { text: '', done: false },
      { text: '', done: false }
    ]
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (task && isOpen) {
      // 格式化deadline为datetime-local格式
      let deadlineValue = '';
      if (task.deadline) {
        const date = new Date(task.deadline);
        if (!isNaN(date.getTime())) {
          deadlineValue = date.toISOString().slice(0, 16);
        }
      }
      
      setFormData({
        title: task.title || '',
        content: task.content || '',
        deadline: deadlineValue,
        steps: task.steps?.length === 3 ? task.steps : [
          { text: task.steps?.[0]?.text || '', done: task.steps?.[0]?.done || false },
          { text: task.steps?.[1]?.text || '', done: task.steps?.[1]?.done || false },
          { text: task.steps?.[2]?.text || '', done: task.steps?.[2]?.done || false }
        ]
      });
    }
  }, [task, isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleStepChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      )
    }));
  };

  const handleSave = () => {
    // 处理deadline数据 - 转换为ISO字符串或null
    const processedFormData = {
      ...formData,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null
    };
    
    onSave({
      ...task,
      ...processedFormData
    });
    onClose();
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    onSave({
      ...task,
      deleted: true
    });
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleOverlayClick}>
      <Modal>
        <Header>
          <Title>{t.taskDetail.editTask}</Title>
          <Subtitle>{t.taskDetail.editDescription}</Subtitle>
          <CloseButton onClick={onClose}>
            ×
          </CloseButton>
        </Header>
        
        <Content>
          <FormGroup>
            <Label>{t.taskDetail.title}</Label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={t.taskDetail.titlePlaceholder}
            />
          </FormGroup>

          <FormGroup>
            <Label>{t.taskDetail.content}</Label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder={t.taskDetail.contentPlaceholder}
            />
          </FormGroup>

          <FormGroup>
            <Label>{t.taskDetail.deadline}</Label>
            <Input
              type="datetime-local"
              lang="en"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
            />
            <div style={{ 
              fontSize: '12px', 
              color: theme.secondaryText, 
              marginTop: '8px',
              fontStyle: 'italic'
            }}>
              {t.taskDetail.deadlineNote}
            </div>
          </FormGroup>

          <FormGroup>
            <Label>{t.taskDetail.steps}</Label>
            <StepsSection>
              {formData.steps.map((step, index) => (
                <StepItem key={index} completed={step.done}>
                  <StepNumber completed={step.done}>
                    {index + 1}
                  </StepNumber>
                  <StepCheckbox
                    type="checkbox"
                    checked={step.done}
                    onChange={(e) => handleStepChange(index, 'done', e.target.checked)}
                  />
                  <StepInput
                    type="text"
                    value={step.text}
                    onChange={(e) => handleStepChange(index, 'text', e.target.value)}
                    placeholder={`${t.taskDetail.step} ${index + 1}`}
                  />
                </StepItem>
              ))}
            </StepsSection>
          </FormGroup>

          <ButtonGroup>
            <DeleteButton onClick={handleDeleteClick}>
              {t.taskDetail.delete}
            </DeleteButton>
            <MainButtons>
              <Button onClick={onClose}>
                {t.taskDetail.cancel}
              </Button>
              <Button primary onClick={handleSave}>
                {t.taskDetail.save}
              </Button>
            </MainButtons>
          </ButtonGroup>
        </Content>
      </Modal>
      
      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <DeleteConfirmOverlay onClick={(e) => e.target === e.currentTarget && handleDeleteCancel()}>
          <DeleteConfirmModal>
            <DeleteConfirmTitle>
              {t.taskDetail.deleteConfirm}
            </DeleteConfirmTitle>
            <DeleteConfirmMessage>
              {t.taskDetail.deleteMessage}
            </DeleteConfirmMessage>
            <DeleteConfirmButtons>
              <Button onClick={handleDeleteCancel}>
                {t.taskDetail.cancelDelete}
              </Button>
              <DeleteButton onClick={handleDeleteConfirm}>
                {t.taskDetail.confirmDelete}
              </DeleteButton>
            </DeleteConfirmButtons>
          </DeleteConfirmModal>
        </DeleteConfirmOverlay>
      )}
    </Overlay>
  );
}
