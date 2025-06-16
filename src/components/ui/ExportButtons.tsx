import React, { useState } from 'react';
import { Download, FileText, Table, Loader2 } from 'lucide-react';
import Button from './Button';
import { useExport } from '../../hooks/useExport';
import { DailyTask } from '../../contexts/AppContext';

interface ExportButtonsProps {
  tasks: DailyTask[];
  selectedDate: Date;
  stats?: {
    completedToday: number;
    totalToday: number;
    completedThisWeek: number;
    totalThisWeek: number;
    streak: number;
  };
  className?: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ 
  tasks, 
  selectedDate, 
  stats, 
  className = "" 
}) => {
  const { exportAsCSV, exportAsPDF } = useExport();
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      await exportAsPDF({ tasks, selectedDate, stats });
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExportingCSV(true);
    try {
      await exportAsCSV({ tasks, selectedDate });
    } catch (error) {
      console.error('CSV export failed:', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setIsExportingCSV(false);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <Button
        variant="outline"
        onClick={handleExportPDF}
        disabled={isExportingPDF || isExportingCSV}
        className="flex-1 sm:flex-none"
      >
        {isExportingPDF ? (
          <Loader2 size={16} className="mr-2 animate-spin" />
        ) : (
          <FileText size={16} className="mr-2" />
        )}
        {isExportingPDF ? 'Generating PDF...' : 'Export as PDF'}
      </Button>
      
      <Button
        variant="outline"
        onClick={handleExportCSV}
        disabled={isExportingPDF || isExportingCSV}
        className="flex-1 sm:flex-none"
      >
        {isExportingCSV ? (
          <Loader2 size={16} className="mr-2 animate-spin" />
        ) : (
          <Table size={16} className="mr-2" />
        )}
        {isExportingCSV ? 'Generating CSV...' : 'Export as CSV'}
      </Button>
    </div>
  );
};

export default ExportButtons;