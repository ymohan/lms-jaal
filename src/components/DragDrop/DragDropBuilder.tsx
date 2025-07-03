import React, { useState } from 'react';
import { Plus, GripVertical, Trash2, Edit, Eye, EyeOff, Download, FileText, Image, Video, Mic, Volume2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { LessonContent, Question } from '../../types';
import { ValidationUtils } from '../../utils/validation';

interface DragDropBuilderProps {
  type: 'lesson' | 'quiz';
  items: (LessonContent | Question)[];
  onItemsChange: (items: (LessonContent | Question)[]) => void;
  onAddItem: () => void;
}

export function DragDropBuilder({ type, items, onItemsChange, onAddItem }: DragDropBuilderProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<string | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);
    
    // Update order property
    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      order: index + 1,
    }));
    
    onItemsChange(updatedItems);
  };

  const handleEdit = (itemId: string) => {
    setEditingItem(itemId);
  };

  const handleSave = (itemId: string, updates: any) => {
    const sanitizedUpdates = {
      ...updates,
      content: ValidationUtils.sanitizeInput(updates.content || ''),
    };
    
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, ...sanitizedUpdates } : item
    );
    
    onItemsChange(updatedItems);
    setEditingItem(null);
  };

  const handleDelete = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const filteredItems = items.filter(item => item.id !== itemId);
      const reorderedItems = filteredItems.map((item, index) => ({
        ...item,
        order: index + 1,
      }));
      onItemsChange(reorderedItems);
    }
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'text': return <FileText className="h-4 w-4" />;
      case 'audio': return <Volume2 className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'tpr-activity': return <Mic className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const renderLessonContent = (content: LessonContent) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Type:</span>
        <div className="flex items-center space-x-2">
          {getContentTypeIcon(content.type)}
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm capitalize">
            {content.type.replace('-', ' ')}
          </span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Content Type
        </label>
        <select
          defaultValue={content.type}
          onChange={(e) => handleSave(content.id, { type: e.target.value })}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="text">Text Content</option>
          <option value="audio">Audio Content</option>
          <option value="video">Video Content</option>
          <option value="image">Image Content</option>
          <option value="interactive">Interactive Element</option>
          <option value="tpr-activity">TPR Activity</option>
          <option value="reading-exercise">Reading Exercise</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Content
        </label>
        <textarea
          defaultValue={content.content}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          rows={4}
          onBlur={(e) => handleSave(content.id, { content: e.target.value })}
          placeholder="Enter your content here..."
        />
      </div>

      {content.type === 'audio' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Audio URL
          </label>
          <input
            type="url"
            defaultValue={content.audioUrl || ''}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            onBlur={(e) => handleSave(content.id, { audioUrl: e.target.value })}
            placeholder="https://example.com/audio.mp3"
          />
        </div>
      )}

      {content.type === 'video' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Video URL
          </label>
          <input
            type="url"
            defaultValue={content.videoUrl || ''}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            onBlur={(e) => handleSave(content.id, { videoUrl: e.target.value })}
            placeholder="https://example.com/video.mp4"
          />
        </div>
      )}

      {content.type === 'image' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Image URL
          </label>
          <input
            type="url"
            defaultValue={content.imageUrl || ''}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            onBlur={(e) => handleSave(content.id, { imageUrl: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      )}

      {content.type === 'tpr-activity' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              TPR Action
            </label>
            <input
              type="text"
              defaultValue={content.metadata?.tprAction || ''}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., wave, clap, stand up"
              onBlur={(e) => handleSave(content.id, { 
                metadata: { ...content.metadata, tprAction: e.target.value }
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Difficulty Level
            </label>
            <select
              defaultValue={content.metadata?.difficulty || 'easy'}
              onChange={(e) => handleSave(content.id, { 
                metadata: { ...content.metadata, difficulty: e.target.value }
              })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      )}

      {content.type === 'reading-exercise' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reading Level
          </label>
          <select
            defaultValue={content.metadata?.readingLevel || 'beginner'}
            onChange={(e) => handleSave(content.id, { 
              metadata: { ...content.metadata, readingLevel: e.target.value }
            })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      )}
    </div>
  );

  const renderQuestion = (question: Question) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Type:</span>
        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-sm capitalize">
          {question.type.replace('-', ' ')}
        </span>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Points:</span>
        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-sm">
          {question.points}
        </span>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Question Type
        </label>
        <select
          defaultValue={question.type}
          onChange={(e) => handleSave(question.id, { type: e.target.value })}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="mcq">Multiple Choice</option>
          <option value="fill-blank">Fill in the Blank</option>
          <option value="audio">Audio Question</option>
          <option value="tpr">TPR Activity</option>
          <option value="speaking">Speaking Exercise</option>
          <option value="matching">Matching</option>
          <option value="ordering">Ordering</option>
          <option value="essay">Essay Question</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Question
        </label>
        <textarea
          defaultValue={question.question}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          rows={3}
          onBlur={(e) => handleSave(question.id, { question: e.target.value })}
          placeholder="Enter your question here..."
        />
      </div>

      {(question.type === 'mcq' || question.type === 'matching') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Options (one per line)
          </label>
          <textarea
            defaultValue={question.options?.join('\n') || ''}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            rows={4}
            onBlur={(e) => handleSave(question.id, { 
              options: e.target.value.split('\n').filter(opt => opt.trim())
            })}
            placeholder="Option 1&#10;Option 2&#10;Option 3&#10;Option 4"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Correct Answer
          </label>
          <input
            type="text"
            defaultValue={Array.isArray(question.correctAnswer) 
              ? question.correctAnswer.join(', ') 
              : question.correctAnswer}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            onBlur={(e) => handleSave(question.id, { correctAnswer: e.target.value })}
            placeholder="Enter correct answer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Points
          </label>
          <input
            type="number"
            defaultValue={question.points}
            min="1"
            max="100"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            onBlur={(e) => handleSave(question.id, { points: parseInt(e.target.value) })}
          />
        </div>
      </div>

      {question.type === 'audio' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Audio URL
          </label>
          <input
            type="url"
            defaultValue={question.audioUrl || ''}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            onBlur={(e) => handleSave(question.id, { audioUrl: e.target.value })}
            placeholder="https://example.com/audio.mp3"
          />
        </div>
      )}

      {question.type === 'tpr' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            TPR Action
          </label>
          <input
            type="text"
            defaultValue={question.metadata?.tprAction || ''}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="e.g., wave, clap, stand up"
            onBlur={(e) => handleSave(question.id, { 
              metadata: { ...question.metadata, tprAction: e.target.value }
            })}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Explanation (Optional)
        </label>
        <textarea
          defaultValue={question.explanation || ''}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          rows={2}
          onBlur={(e) => handleSave(question.id, { explanation: e.target.value })}
          placeholder="Explain why this is the correct answer..."
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {type === 'lesson' ? 'Lesson Content' : 'Quiz Questions'}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              const data = JSON.stringify(items, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${type}-content.json`;
              a.click();
            }}
            className="bg-gray-600 dark:bg-gray-700 text-white px-3 py-2 rounded-lg font-medium hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={onAddItem}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add {type === 'lesson' ? 'Content' : 'Question'}</span>
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all duration-200 ${
                        snapshot.isDragging 
                          ? 'opacity-50 scale-95 shadow-lg' 
                          : 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div 
                          {...provided.dragHandleProps}
                          className="flex flex-col items-center space-y-2 pt-1"
                        >
                          <GripVertical className="h-5 w-5 text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing" />
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            #{index + 1}
                          </span>
                        </div>

                        <div className="flex-1">
                          {editingItem === item.id ? (
                            <div className="space-y-4">
                              {type === 'lesson' 
                                ? renderLessonContent(item as LessonContent)
                                : renderQuestion(item as Question)
                              }
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="px-3 py-1 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    {type === 'lesson' && getContentTypeIcon((item as LessonContent).type)}
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                      {type === 'lesson' 
                                        ? `${(item as LessonContent).type.replace('-', ' ')} Content`
                                        : (item as Question).question
                                      }
                                    </h4>
                                    {type === 'quiz' && (
                                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs">
                                        {(item as Question).points} pts
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {item.content || (item as Question).question}
                                  </p>
                                  {type === 'quiz' && (item as Question).options && (
                                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                      Options: {(item as Question).options?.length} choices
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center space-x-1 ml-4">
                                  <button
                                    onClick={() => setPreviewItem(
                                      previewItem === item.id ? null : item.id
                                    )}
                                    className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                                    title="Preview"
                                  >
                                    {previewItem === item.id ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleEdit(item.id)}
                                    className="p-1 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    title="Edit"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              {previewItem === item.id && (
                                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded border dark:border-gray-600">
                                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</h5>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {type === 'lesson' 
                                      ? renderLessonContent(item as LessonContent)
                                      : renderQuestion(item as Question)
                                    }
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {items.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="text-gray-500 dark:text-gray-400">
            <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">
              No {type === 'lesson' ? 'content' : 'questions'} added yet
            </p>
            <p className="text-sm">
              Click "Add {type === 'lesson' ? 'Content' : 'Question'}" to get started
            </p>
          </div>
        </div>
      )}
    </div>
  );
}