import { useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import { DailyTask } from '../contexts/AppContext';

interface ExportOptions {
  tasks: DailyTask[];
  selectedDate: Date;
  stats?: {
    completedToday: number;
    totalToday: number;
    completedThisWeek: number;
    totalThisWeek: number;
    streak: number;
  };
}

export const useExport = () => {
  // Export tasks as CSV
  const exportAsCSV = useCallback((options: ExportOptions) => {
    const { tasks, selectedDate } = options;
    
    // Prepare CSV headers
    const headers = ['Task Name', 'Date', 'Due Time', 'Priority', 'Status', 'Created At', 'Completed At'];
    
    // Prepare CSV rows
    const rows = tasks.map(task => [
      `"${task.name.replace(/"/g, '""')}"`, // Escape quotes in task name
      task.date,
      task.dueTime || '',
      task.priority,
      task.completed ? 'Completed' : 'Pending',
      task.createdAt.toISOString(),
      task.completedAt ? task.completedAt.toISOString() : ''
    ]);
    
    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `daily-planner-${format(selectedDate, 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }, []);

  // Export planner view as PDF
  const exportAsPDF = useCallback(async (options: ExportOptions) => {
    const { tasks, selectedDate, stats } = options;
    
    try {
      // Create a temporary container for PDF content
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '800px';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.padding = '40px';
      tempContainer.style.fontFamily = 'Inter, system-ui, sans-serif';
      
      // Create PDF content
      const isToday = selectedDate.toDateString() === new Date().toDateString();
      const dateString = format(selectedDate, 'EEEE, MMMM d, yyyy');
      
      tempContainer.innerHTML = `
        <div style="margin-bottom: 40px;">
          <h1 style="font-size: 32px; font-weight: bold; color: #1f2937; margin: 0 0 8px 0;">
            Daily Planner
          </h1>
          <p style="font-size: 18px; color: #6b7280; margin: 0;">
            ${isToday ? 'Today' : dateString}
          </p>
        </div>

        ${stats ? `
          <div style="margin-bottom: 40px; padding: 24px; background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
            <h2 style="font-size: 20px; font-weight: 600; color: #1f2937; margin: 0 0 16px 0;">
              Productivity Summary
            </h2>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
              <div>
                <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">Today's Progress</p>
                <p style="font-size: 24px; font-weight: bold; color: #1f2937; margin: 0;">
                  ${stats.completedToday}/${stats.totalToday} tasks
                </p>
              </div>
              <div>
                <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">This Week</p>
                <p style="font-size: 24px; font-weight: bold; color: #1f2937; margin: 0;">
                  ${stats.completedThisWeek} completed
                </p>
              </div>
              <div>
                <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">Daily Streak</p>
                <p style="font-size: 24px; font-weight: bold; color: #f59e0b; margin: 0;">
                  ${stats.streak} days
                </p>
              </div>
              <div>
                <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">Completion Rate</p>
                <p style="font-size: 24px; font-weight: bold; color: #10b981; margin: 0;">
                  ${stats.totalToday > 0 ? Math.round((stats.completedToday / stats.totalToday) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        ` : ''}

        <div>
          <h2 style="font-size: 20px; font-weight: 600; color: #1f2937; margin: 0 0 24px 0;">
            Tasks (${tasks.length})
          </h2>
          
          ${tasks.length === 0 ? `
            <div style="text-align: center; padding: 48px 0; color: #6b7280;">
              <p style="font-size: 18px; margin: 0 0 8px 0;">No tasks for this day</p>
              <p style="font-size: 14px; margin: 0;">Add tasks to see them in your planner</p>
            </div>
          ` : `
            <div style="space-y: 16px;">
              ${tasks.map((task, index) => {
                const priorityColors = {
                  'High': { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
                  'Medium': { bg: '#fffbeb', text: '#d97706', border: '#fed7aa' },
                  'Low': { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' }
                };
                const colors = priorityColors[task.priority as keyof typeof priorityColors];
                
                return `
                  <div style="
                    padding: 20px; 
                    border: 1px solid #e5e7eb; 
                    border-radius: 12px; 
                    background-color: ${task.completed ? '#f9fafb' : 'white'};
                    ${index < tasks.length - 1 ? 'margin-bottom: 16px;' : ''}
                    opacity: ${task.completed ? '0.7' : '1'};
                  ">
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                      <div style="
                        width: 20px; 
                        height: 20px; 
                        border: 2px solid ${task.completed ? '#4f46e5' : '#d1d5db'}; 
                        border-radius: 4px; 
                        background-color: ${task.completed ? '#4f46e5' : 'transparent'};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                        margin-top: 2px;
                      ">
                        ${task.completed ? '<span style="color: white; font-size: 12px;">✓</span>' : ''}
                      </div>
                      
                      <div style="flex: 1;">
                        <h3 style="
                          font-size: 16px; 
                          font-weight: 600; 
                          color: ${task.completed ? '#6b7280' : '#1f2937'}; 
                          margin: 0 0 8px 0;
                          ${task.completed ? 'text-decoration: line-through;' : ''}
                        ">
                          ${task.name}
                        </h3>
                        
                        <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
                          <span style="
                            display: inline-flex;
                            align-items: center;
                            padding: 4px 8px;
                            font-size: 12px;
                            font-weight: 500;
                            border-radius: 9999px;
                            background-color: ${colors.bg};
                            color: ${colors.text};
                            border: 1px solid ${colors.border};
                          ">
                            🏷️ ${task.priority}
                          </span>
                          
                          ${task.dueTime ? `
                            <span style="
                              display: inline-flex;
                              align-items: center;
                              font-size: 12px;
                              color: #6b7280;
                            ">
                              🕐 ${task.dueTime}
                            </span>
                          ` : ''}
                          
                          ${task.completed && task.completedAt ? `
                            <span style="
                              font-size: 12px;
                              color: #6b7280;
                            ">
                              Completed at ${new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          ` : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
          </p>
          <p style="font-size: 12px; color: #9ca3af; margin: 4px 0 0 0;">
            Personal Dashboard - Daily Planner Export
          </p>
        </div>
      `;
      
      document.body.appendChild(tempContainer);
      
      // Generate canvas from the content
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempContainer.scrollHeight
      });
      
      // Remove temporary container
      document.body.removeChild(tempContainer);
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 10; // 10mm top margin
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20); // Account for margins
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 20);
      }
      
      // Download PDF
      pdf.save(`daily-planner-${format(selectedDate, 'yyyy-MM-dd')}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }, []);

  return {
    exportAsCSV,
    exportAsPDF
  };
};