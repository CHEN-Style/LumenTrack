import { useEffect, useState } from "react"
import { useTheme } from 'styled-components'; 
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useMode } from '../contexts/modeContext';
import zhCN from '../locales/zh-CN';
import enUS from '../locales/en-US';
import { 
  addTask, 
  getActiveTasks, 
  updateTask, 
  getMaxOrderInQuadrant,
  updateTasksOrder,
  toggleTaskCompleted
} from '../db/db.js';
import TaskDetailModal from './taskDetailPage.jsx';

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const LeftPanel = styled.div`
  width: 300px;
  padding: 20px;
  background: ${props => props.theme.cardBackground};
  border-right: 1px solid ${props => props.theme.secondaryText}20;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightPanel = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TaskInput = styled.input`
  padding: 12px;
  border: 2px solid ${props => props.theme.secondaryText}30;
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #3498db;
  }

  &::placeholder {
    color: ${props => props.theme.secondaryText};
  }
`;

const CreateButton = styled.button`
  padding: 12px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #2980b9;
  }

  &:disabled {
    background: ${props => props.theme.secondaryText}50;
    cursor: not-allowed;
  }
`;

const TaskList = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 200px;
`;

const TaskCard = styled.div`
  padding: 12px;
  background: ${props => props.completed ? '#27ae6015' : props.theme.background};
  border: 1px solid ${props => props.completed ? '#27ae6030' : props.theme.secondaryText + '30'};
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: grab;
  user-select: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.secondaryText}20;
  }

  &:active {
    cursor: grabbing;
  }
`;

const TaskContent = styled.div`
  flex: 1;
  color: ${props => props.completed ? props.theme.secondaryText : props.theme.text};
  cursor: pointer;
  transition: color 0.3s ease;
`;

const TaskCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin: 0;
`;

const MatrixContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
  height: 100%;
`;

const MatrixTitle = styled.h2`
  margin: 0 0 20px 0;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
`;

const Quadrant = styled.div`
  border: 2px dashed ${props => props.borderColor}50;
  border-radius: 12px;
  padding: 20px;
  background: ${props => props.bgColor}10;
  min-height: 200px;
  transition: all 0.3s ease;

  &.drag-over {
    border-color: ${props => props.borderColor};
    background: ${props => props.bgColor}20;
    transform: scale(1.02);
  }
`;

const QuadrantHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  font-weight: 600;
  font-size: 14px;
`;

const QuadrantTitle = styled.span`
  color: ${props => props.color};
`;

const QuadrantTasks = styled.div`
  min-height: 50px;
`;

const QuadrantTask = styled.div`
  padding: 8px 12px;
  background: ${props => props.completed ? '#27ae6015' : props.theme.cardBackground};
  border: 1px solid ${props => props.completed ? '#27ae6030' : props.theme.secondaryText + '20'};
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 13px;
  box-shadow: 0 2px 4px ${props => props.theme.secondaryText}10;
  cursor: grab;
  user-select: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px ${props => props.theme.secondaryText}20;
  }

  &:active {
    cursor: grabbing;
  }
`;

const QuadrantTaskContent = styled.div`
  flex: 1;
  color: ${props => props.completed ? props.theme.secondaryText : props.theme.text};
  cursor: pointer;
  transition: color 0.3s ease;
`;

const QuadrantTaskCheckbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin: 0;
`;

const EmptyState = styled.div`
  color: ${props => props.theme.secondaryText};
  text-align: center;
  padding: 20px;
  font-style: italic;
  font-size: 12px;
  border: 2px dashed ${props => props.theme.secondaryText}30;
  border-radius: 8px;
  background: ${props => props.theme.background}50;
`;

const LanguageToggle = styled.button`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.secondaryText}30;
  border-radius: 8px;
  padding: 8px 12px;
  color: ${props => props.theme.text};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px ${props => props.theme.secondaryText}20;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.secondaryText}30;
    border-color: #3498db;
  }

  &:active {
    transform: translateY(0);
  }
`;

export default function TodoPage() {
  const theme = useTheme()
  const { language, toggleLanguage } = useMode()
  const t = language === 'zh-CN' ? zhCN : enUS
  
  const [taskTitle, setTaskTitle] = useState('')
  const [tasks, setTasks] = useState([])
  const [quadrants, setQuadrants] = useState({
    Q1: [],
    Q2: [],
    Q3: [],
    Q4: [],
  })
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const quadrantConfig = {
    Q1: {
      title: t.todoPage.quadrant1,
      subtitle: t.todoPage.quadrant1Desc,
      color: '#e74c3c',
      bgColor: '#e74c3c'
    },
    Q2: {
      title: t.todoPage.quadrant2,
      subtitle: t.todoPage.quadrant2Desc,
      color: '#27ae60',
      bgColor: '#27ae60'
    },
    Q3: {
      title: t.todoPage.quadrant3,
      subtitle: t.todoPage.quadrant3Desc,
      color: '#f39c12',
      bgColor: '#f39c12'
    },
    Q4: {
      title: t.todoPage.quadrant4,
      subtitle: t.todoPage.quadrant4Desc,
      color: '#3498db',
      bgColor: '#3498db'
    }
  }

  // 从数据库加载任务
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const allTasks = await getActiveTasks()
        
        // 分离未分配的任务和已分配到象限的任务
        const unassignedTasks = allTasks.filter(task => task.quadrant === 'none')
        const assignedTasks = allTasks.filter(task => task.quadrant !== 'none')
        
        // 按象限分组任务
        const quadrantTasks = {
          Q1: assignedTasks.filter(task => task.quadrant === 'Q1').sort((a, b) => a.order - b.order),
          Q2: assignedTasks.filter(task => task.quadrant === 'Q2').sort((a, b) => a.order - b.order),
          Q3: assignedTasks.filter(task => task.quadrant === 'Q3').sort((a, b) => a.order - b.order),
          Q4: assignedTasks.filter(task => task.quadrant === 'Q4').sort((a, b) => a.order - b.order),
        }
        
        setTasks(unassignedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
        setQuadrants(quadrantTasks)
      } catch (error) {
        console.error('Failed to load tasks:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadTasks()
  }, [])

  const handleCreateTask = async () => {
    if (taskTitle.trim()) {
      const newTask = {
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: taskTitle.trim(),
        content: '',
        steps: [
          { text: '', done: false },
          { text: '', done: false },
          { text: '', done: false }
        ],
        createdAt: new Date().toISOString(),
        quadrant: 'none',
        order: 0,
        importance: 3,
        urgency: 3,
        completed: false,
        archived: false,
        tags: [],
        noteIds: [],
        emotionLog: [],
        repeatRule: null,
        color: '#cccccc',
      }
      
      try {
        await addTask(newTask)
        setTasks([newTask, ...tasks])
        setTaskTitle('')
      } catch (error) {
        console.error('Failed to create task:', error)
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreateTask()
    }
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedTask(null)
  }

  const handleSaveTaskDetail = async (updatedTask) => {
    try {
      await updateTask(updatedTask.id, updatedTask)
      
      // 更新本地状态
      if (updatedTask.quadrant === 'none') {
        setTasks(prev => prev.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ))
      } else {
        setQuadrants(prev => ({
          ...prev,
          [updatedTask.quadrant]: prev[updatedTask.quadrant].map(task =>
            task.id === updatedTask.id ? updatedTask : task
          )
        }))
      }
    } catch (error) {
      console.error('Failed to save task details:', error)
    }
  }

  const handleToggleCompleted = async (e, taskId, taskSource) => {
    e.stopPropagation() // 防止触发任务点击事件
    e.preventDefault()
    
    try {
      const updatedTask = await toggleTaskCompleted(taskId)
      if (updatedTask) {
        // 更新本地状态
        if (taskSource === 'tasks') {
          setTasks(prev => prev.map(task => 
            task.id === taskId ? updatedTask : task
          ))
        } else {
          setQuadrants(prev => ({
            ...prev,
            [taskSource]: prev[taskSource].map(task =>
              task.id === taskId ? updatedTask : task
            )
          }))
        }
      }
    } catch (error) {
      console.error('Failed to toggle task completion:', error)
    }
  }

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result

    // 如果没有目标位置，取消拖拽
    if (!destination) {
      return
    }

    // 如果拖拽到同一位置，取消拖拽
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    try {
      // 从待分配任务拖拽到象限
      if (source.droppableId === 'tasks') {
        await handleDropFromTasks(draggableId, destination)
      }
      // 象限内重新排序
      else if (source.droppableId === destination.droppableId) {
        await handleReorderWithinQuadrant(source, destination, draggableId)
      }
      // 在象限之间移动
      else {
        await handleMoveBetweenQuadrants(source, destination, draggableId)
      }
    } catch (error) {
      console.error('Failed to handle drag end:', error)
    }
  }

  const handleDropFromTasks = async (taskId, destination) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    const targetQuadrant = destination.droppableId
    const targetTasks = [...quadrants[targetQuadrant]]
    
    // 计算新的order值
    const updates = []
    let orderCounter = 1
    
    // 在指定位置插入任务
    for (let i = 0; i <= targetTasks.length; i++) {
      if (i === destination.index) {
        updates.push({
          id: task.id,
          quadrant: targetQuadrant,
          order: orderCounter++
        })
      }
      if (i < targetTasks.length) {
        updates.push({
          id: targetTasks[i].id,
          order: orderCounter++
        })
      }
    }
    
    await updateTasksOrder(updates)
    
    // 更新本地状态
    const updatedTask = { ...task, quadrant: targetQuadrant, order: updates.find(u => u.id === task.id).order }
    setTasks(tasks.filter(t => t.id !== taskId))
    
    const newTargetTasks = [...targetTasks]
    newTargetTasks.splice(destination.index, 0, updatedTask)
    setQuadrants(prev => ({
      ...prev,
      [targetQuadrant]: newTargetTasks
    }))
  }

  const handleReorderWithinQuadrant = async (source, destination, taskId) => {
    const quadrantId = source.droppableId
    const quadrantTasks = [...quadrants[quadrantId]]
    
    // 移动任务到新位置
    const [movedTask] = quadrantTasks.splice(source.index, 1)
    quadrantTasks.splice(destination.index, 0, movedTask)
    
    // 重新计算order
    const updates = quadrantTasks.map((task, index) => ({
      id: task.id,
      order: index + 1
    }))
    
    await updateTasksOrder(updates)
    
    // 更新本地状态
    setQuadrants(prev => ({
      ...prev,
      [quadrantId]: quadrantTasks
    }))
  }

  const handleMoveBetweenQuadrants = async (source, destination, taskId) => {
    const sourceQuadrant = source.droppableId
    const targetQuadrant = destination.droppableId
    
    const sourceTasks = [...quadrants[sourceQuadrant]]
    const targetTasks = [...quadrants[targetQuadrant]]
    
    // 移除源任务
    const [movedTask] = sourceTasks.splice(source.index, 1)
    // 插入到目标位置
    targetTasks.splice(destination.index, 0, movedTask)
    
    const updates = []
    
    // 更新源象限任务的order
    sourceTasks.forEach((task, index) => {
      updates.push({
        id: task.id,
        order: index + 1
      })
    })
    
    // 更新目标象限任务的order和quadrant
    targetTasks.forEach((task, index) => {
      updates.push({
        id: task.id,
        quadrant: targetQuadrant,
        order: index + 1
      })
    })
    
    await updateTasksOrder(updates)
    
    // 更新本地状态
    setQuadrants(prev => ({
      ...prev,
      [sourceQuadrant]: sourceTasks,
      [targetQuadrant]: targetTasks
    }))
  }

  if (loading) {
    return (
      <Container>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: theme.secondaryText
        }}>
          {t.todoPage.loading}
        </div>
      </Container>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Container>
        <LeftPanel>
          <InputSection>
            <h3 style={{ margin: '0 0 10px 0' }}>{t.todoPage.createNewTask}</h3>
            <TaskInput
              type="text"
              placeholder={t.todoPage.taskPlaceholder}
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <CreateButton 
              onClick={handleCreateTask}
              disabled={!taskTitle.trim()}
            >
              {t.todoPage.createTask}
            </CreateButton>
          </InputSection>

          <div>
            <h3 style={{ margin: '0 0 15px 0' }}>{t.todoPage.pendingTasks} ({tasks.length})</h3>
            <Droppable droppableId="tasks">
              {(provided, snapshot) => (
                <TaskList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    background: snapshot.isDraggingOver ? 
                      `${theme.secondaryText}10` : 'transparent',
                    borderRadius: '8px',
                    transition: 'background 0.2s ease'
                  }}
                >
                  {tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <TaskCard
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          completed={task.completed}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.8 : 1,
                            transform: snapshot.isDragging ? 
                              `${provided.draggableProps.style?.transform} rotate(3deg)` : 
                              provided.draggableProps.style?.transform
                          }}
                        >
                          <TaskCheckbox
                            type="checkbox"
                            checked={task.completed || false}
                            onChange={(e) => handleToggleCompleted(e, task.id, 'tasks')}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <TaskContent 
                            completed={task.completed}
                            onClick={() => handleTaskClick(task)}
                          >
                            {task.title}
                          </TaskContent>
                        </TaskCard>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {tasks.length === 0 && (
                    <EmptyState>
                      {t.todoPage.noTasks}
                    </EmptyState>
                  )}
                </TaskList>
              )}
            </Droppable>
          </div>
        </LeftPanel>

        <RightPanel>
          <MatrixTitle>{t.todoPage.priorityMatrix}</MatrixTitle>
          <MatrixContainer>
            {Object.entries(quadrantConfig).map(([quadrantId, config]) => (
              <Quadrant
                key={quadrantId}
                borderColor={config.color}
                bgColor={config.bgColor}
              >
                <QuadrantHeader>
                  <QuadrantTitle color={config.color}>
                    {config.title}
                  </QuadrantTitle>
                </QuadrantHeader>
                <div style={{ 
                  fontSize: '12px', 
                  color: theme.secondaryText, 
                  marginBottom: '15px' 
                }}>
                  {config.subtitle}
                </div>
                
                <Droppable droppableId={quadrantId}>
                  {(provided, snapshot) => (
                    <QuadrantTasks
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        background: snapshot.isDraggingOver ? 
                          `${config.bgColor}20` : 'transparent',
                        borderRadius: '8px',
                        padding: '8px',
                        transition: 'background 0.2s ease',
                        minHeight: '60px'
                      }}
                    >
                      {quadrants[quadrantId].map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <QuadrantTask
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              completed={task.completed}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.8 : 1,
                                transform: snapshot.isDragging ? 
                                  `${provided.draggableProps.style?.transform} rotate(2deg)` : 
                                  provided.draggableProps.style?.transform
                              }}
                            >
                              <QuadrantTaskCheckbox
                                type="checkbox"
                                checked={task.completed || false}
                                onChange={(e) => handleToggleCompleted(e, task.id, quadrantId)}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <QuadrantTaskContent 
                                completed={task.completed}
                                onClick={() => handleTaskClick(task)}
                              >
                                {task.title}
                              </QuadrantTaskContent>
                            </QuadrantTask>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {quadrants[quadrantId].length === 0 && (
                        <EmptyState>
                          {t.todoPage.dropHere}
                        </EmptyState>
                      )}
                    </QuadrantTasks>
                  )}
                </Droppable>
              </Quadrant>
            ))}
          </MatrixContainer>
        </RightPanel>
        
        {/* 语言切换按钮 */}
        <LanguageToggle onClick={toggleLanguage}>
          <span>🌐</span>
          <span>{language === 'zh-CN' ? 'EN' : '中文'}</span>
        </LanguageToggle>

        {/* 任务详情模态框 */}
        <TaskDetailModal
          task={selectedTask}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          onSave={handleSaveTaskDetail}
        />
      </Container>
    </DragDropContext>
  )
}