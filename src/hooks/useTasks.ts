
import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import type { Task, TaskStatus } from '../components/types';
import { toast } from '@/hooks/use-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate().toISOString() : data.dueDate,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
          completedAt: data.completedAt instanceof Timestamp ? data.completedAt.toDate().toISOString() : data.completedAt,
        } as Task;
      });
      setTasks(tasksData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addTask = async (taskData: Omit<Task, 'id'>) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        ...taskData,
        userId: user.uid,
        starred: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      toast({
        title: "Task created",
        description: "Your task has been successfully created.",
        variant: "aurora",
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Omit<Task, 'id'>>) => {
    if (!user) return;

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      
      if (updates.starred !== undefined) {
        toast({
          title: updates.starred ? "Task starred" : "Task unstarred",
          description: updates.starred ? "Task added to favorites." : "Task removed from favorites.",
          variant: "aurora",
        });
      } else if (updates.status === "Completed") {
        toast({
          title: "Task completed",
          description: "Great job! Task marked as completed.",
          variant: "aurora",
        });
      } else {
        toast({
          title: "Task updated",
          description: "Your task has been successfully updated.",
          variant: "aurora",
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user) return;

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
      
      toast({
        title: "Task deleted",
        description: "Task has been successfully deleted.",
        variant: "aurora",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const bulkUpdateTasks = async (taskIds: string[], updates: Partial<Omit<Task, 'id'>>) => {
    if (!user || taskIds.length === 0) return;

    try {
      const batch = writeBatch(db);
      
      taskIds.forEach(taskId => {
        const taskRef = doc(db, 'tasks', taskId);
        batch.update(taskRef, {
          ...updates,
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
      
      toast({
        title: "Tasks updated",
        description: `${taskIds.length} tasks have been successfully updated.`,
        variant: "aurora",
      });
    } catch (error) {
      console.error('Error bulk updating tasks:', error);
      toast({
        title: "Error",
        description: "Failed to update tasks. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const bulkDeleteTasks = async (taskIds: string[]) => {
    if (!user || taskIds.length === 0) return;

    try {
      const batch = writeBatch(db);
      
      taskIds.forEach(taskId => {
        const taskRef = doc(db, 'tasks', taskId);
        batch.delete(taskRef);
      });

      await batch.commit();
      
      toast({
        title: "Tasks deleted",
        description: `${taskIds.length} tasks have been successfully deleted.`,
        variant: "aurora",
      });
    } catch (error) {
      console.error('Error bulk deleting tasks:', error);
      toast({
        title: "Error",
        description: "Failed to delete tasks. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    bulkUpdateTasks,
    bulkDeleteTasks,
  };
};
