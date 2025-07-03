import { useState, useCallback } from 'react';
import { DragDropItem } from '../types';

export function useDragDrop<T extends DragDropItem>(initialItems: T[]) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [draggedItem, setDraggedItem] = useState<T | null>(null);

  const handleDragStart = useCallback((item: T) => {
    setDraggedItem(item);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetItem: T) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetItem.id) {
      return;
    }

    const draggedIndex = items.findIndex(item => item.id === draggedItem.id);
    const targetIndex = items.findIndex(item => item.id === targetItem.id);

    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }

    const newItems = [...items];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, removed);

    // Update order property
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setItems(updatedItems);
    setDraggedItem(null);
  }, [items, draggedItem]);

  const addItem = useCallback((item: T) => {
    const newItem = {
      ...item,
      order: items.length + 1,
    };
    setItems(prev => [...prev, newItem]);
  }, [items.length]);

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => {
      const filtered = prev.filter(item => item.id !== itemId);
      return filtered.map((item, index) => ({
        ...item,
        order: index + 1,
      }));
    });
  }, []);

  const updateItem = useCallback((itemId: string, updates: Partial<T>) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
  }, []);

  const reorderItems = useCallback((startIndex: number, endIndex: number) => {
    setItems(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      return result.map((item, index) => ({
        ...item,
        order: index + 1,
      }));
    });
  }, []);

  return {
    items,
    setItems,
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    addItem,
    removeItem,
    updateItem,
    reorderItems,
  };
}