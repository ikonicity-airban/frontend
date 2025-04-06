import React, { useState, useEffect } from 'react';
import {
  BarChart2Icon,
  DownloadIcon,
  FilterIcon,
  RefreshCwIcon,
  PieChartIcon,
  TrendingUpIcon,
  CheckSquareIcon,
  AlertTriangleIcon,
  Loader
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { adminApi } from '../api/admin';
import { format, subMonths, startOfQuarter, endOfQuarter } from 'date-fns';
import { useNotification } from '../context/NotificationContext';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface ReportMetrics {
  averageRating: number;
  completionRate: number;
  pendingReviews: number;
}

interface ReportData {
  performanceData: Array<{ name: string; rating: number }>;
  completionData: Array<{ name: string; value: number }>;
  departmentData: Array<{ name: string; staff: number; completed: number; pending: number }>;
  timelineData: Array<{ day: string; evaluations: number }>;
}

// Initial empty report data
const initialReportData: ReportData = {
  performanceData: [],
  completionData: [],
  departmentData: [],
  timelineData: []
};

const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('performance');
  const [dateRange, setDateRange] = useState('quarter');
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [metrics, setMetrics] = useState<ReportMetrics>({
    averageRating: 4.2,
    completionRate: 85,
    pendingReviews: 12
  });
  const [reportData, setReportData] = useState<ReportData>(initialReportData);
  const { showNotification } = useNotification();

  // Fetch report data when report type or date range changes
  useEffect(() => {
    fetchReportData();
  }, [selectedReport, dateRange]);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      // In a real app, these would be real API calls with proper parameters
      // For now, we'll simulate API responses and add some delay
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

      // Simulate different data based on date range
      const getDateAdjustedData = () => {
        // Base data - this would come from your API in a real app
        const performanceData = [
          { name: 'Development', rating: 4.2 },
          { name: 'QA', rating: 3.9 },
          { name: 'UI/UX', rating: 4.5 },
          { name: 'Marketing', rating: 3.8 },
          { name: 'HR', rating: 4.1 },
          { name: 'Management', rating: 4.3 },
        ];
        
        const completionData = [
          { name: 'Complete', value: dateRange === 'year' ? 92 : dateRange === 'month' ? 75 : 85 },
          { name: 'Pending', value: dateRange === 'year' ? 8 : dateRange === 'month' ? 25 : 15 },
        ];
        
        const departmentData = [
          { name: 'Development', staff: 25, completed: 22, pending: 3 },
          { name: 'QA', staff: 15, completed: 13, pending: 2 },
          { name: 'UI/UX', staff: 10, completed: 9, pending: 1 },
          { name: 'Marketing', staff: 8, completed: 5, pending: 3 },
          { name: 'HR', staff: 5, completed: 5, pending: 0 },
          { name: 'Management', staff: 7, completed: 5, pending: 2 },
        ];
        
        const timelineData = dateRange === 'month' ? 
          [
            { day: 'Week 1', evaluations: 12 },
            { day: 'Week 2', evaluations: 24 },
            { day: 'Week 3', evaluations: 18 },
            { day: 'Week 4', evaluations: 30 },
          ] :
          dateRange === 'year' ?
          [
            { day: 'Q1', evaluations: 65 },
            { day: 'Q2', evaluations: 78 },
            { day: 'Q3', evaluations: 82 },
            { day: 'Q4', evaluations: 91 },
          ] :
          [
            { day: 'Week 1', evaluations: 12 },
            { day: 'Week 2', evaluations: 24 },
            { day: 'Week 3', evaluations: 18 },
            { day: 'Week 4', evaluations: 30 },
            { day: 'Week 5', evaluations: 15 },
            { day: 'Week 6', evaluations: 8 },
          ];

        return {
          performanceData,
          completionData,
          departmentData,
          timelineData
        };
      };

      const data = getDateAdjustedData();
      setReportData(data);
      
      // Update metrics based on the data
      setMetrics({
        averageRating: data.performanceData.reduce((sum, item) => sum + item.rating, 0) / data.performanceData.length,
        completionRate: data.completionData[0].value,
        pendingReviews: data.departmentData.reduce((sum, dept) => sum + dept.pending, 0)
      });

      // Log activity
      adminApi.logActivity({
        action: "viewed report",
        entityType: "report",
        details: `Viewed ${selectedReport} report for ${dateRange} timeframe`
      }).catch(console.error);
    } catch (error) {
      console.error('Error fetching report data:', error);
      showNotification('error', 'Failed to load report data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      // In a real app, this would call an API endpoint to generate and download a report
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate export process
      
      // Fake file download simulation
      const element = document.createElement('a');
      const reportType = selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1);
      const fileName = `${reportType}_Report_${dateRange}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      element.setAttribute('href', 'data:text/plain;charset=utf-8,');
      element.setAttribute('download', fileName);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      showNotification('success', `Report exported successfully as ${fileName}`);
      
      // Log activity
      adminApi.logActivity({
        action: "exported report",
        entityType: "report",
        details: `Exported ${selectedReport} report for ${dateRange} timeframe`
      }).catch(console.error);
    } catch (error) {
      console.error('Error exporting report:', error);
      showNotification('error', 'Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  const renderPerformanceChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={reportData.performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 5]} />
        <Tooltip formatter={(value) => [`${value}/5`, 'Rating']} />
        <Legend />
        <Bar dataKey="rating" fill="#8884d8" name="Avg Rating" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderCompletionChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={reportData.completionData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {reportData.completionData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderDepartmentChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={reportData.departmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="completed" fill="#00C49F" name="Completed" />
        <Bar dataKey="pending" fill="#FFBB28" name="Pending" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderTimelineChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={reportData.timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="evaluations" stroke="#8884d8" name="Evaluations" />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-96">
          <Loader className="h-12 w-12 text-indigo-500 animate-spin" />
          <span className="ml-3 text-lg text-gray-600">Loading report data...</span>
        </div>
      );
    }

    switch (selectedReport) {
      case 'performance':
        return renderPerformanceChart();
      case 'evaluation':
        return renderCompletionChart();
      case 'department':
        return renderDepartmentChart();
      case 'compliance':
        return renderTimelineChart();
      default:
        return renderPerformanceChart();
    }
  };

  // Get date range display
  const getDateRangeDisplay = () => {
    const now = new Date();
    switch (dateRange) {
      case 'month':
        return `${format(subMonths(now, 1), 'MMMM d, yyyy')} - ${format(now, 'MMMM d, yyyy')}`;
      case 'year':
        return `${format(new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()), 'MMMM d, yyyy')} - ${format(now, 'MMMM d, yyyy')}`;
      case 'quarter':
      default:
        const quarterStart = startOfQuarter(now);
        const quarterEnd = endOfQuarter(now);
        return `${format(quarterStart, 'MMMM d, yyyy')} - ${format(quarterEnd, 'MMMM d, yyyy')}`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Report Controls */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-semibold text-gray-900">
              Reports Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {getDateRangeDisplay()}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div>
              <label htmlFor="reportType" className="sr-only">Report Type</label>
              <select
                id="reportType"
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="performance">Performance Report</option>
                <option value="evaluation">Evaluation Status</option>
                <option value="department">Department Overview</option>
                <option value="compliance">Compliance Timeline</option>
              </select>
            </div>
            <div>
              <label htmlFor="dateRange" className="sr-only">Date Range</label>
              <select
                id="dateRange"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="month">Past Month</option>
                <option value="quarter">Current Quarter</option>
                <option value="year">Past Year</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FilterIcon className="h-4 w-4 mr-2" />
            Filters
          </button>
          <button
            type="button"
            onClick={fetchReportData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCwIcon className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            type="button"
            onClick={handleExportReport}
            disabled={isLoading || isExporting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <DownloadIcon className="h-4 w-4 mr-2" />
            )}
            {isExporting ? 'Exporting...' : 'Export Report'}
          </button>
        </div>
      </div>
      {/* Report Content */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {selectedReport === 'performance' && 'Performance Overview'}
            {selectedReport === 'evaluation' && 'Evaluation Status'}
            {selectedReport === 'department' && 'Department Overview'}
            {selectedReport === 'compliance' && 'Compliance Status'}
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center">
                {selectedReport === 'performance' && <BarChart2Icon className="h-6 w-6 text-indigo-600" />}
                {selectedReport === 'evaluation' && <CheckSquareIcon className="h-6 w-6 text-indigo-600" />}
                {selectedReport === 'department' && <PieChartIcon className="h-6 w-6 text-indigo-600" />}
                {selectedReport === 'compliance' && <AlertTriangleIcon className="h-6 w-6 text-indigo-600" />}
                <h3 className="ml-2 text-lg font-medium text-gray-900">
                  Average Rating
                </h3>
              </div>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {isLoading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  `${metrics.averageRating.toFixed(1)}/5`
                )}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Across all evaluations
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center">
                <TrendingUpIcon className="h-6 w-6 text-green-600" />
                <h3 className="ml-2 text-lg font-medium text-gray-900">
                  Completion Rate
                </h3>
              </div>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {isLoading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  `${metrics.completionRate}%`
                )}
              </p>
              <p className="mt-1 text-sm text-gray-500">For current {dateRange}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center">
                <BarChart2Icon className="h-6 w-6 text-yellow-600" />
                <h3 className="ml-2 text-lg font-medium text-gray-900">
                  Pending Reviews
                </h3>
              </div>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {isLoading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  metrics.pendingReviews
                )}
              </p>
              <p className="mt-1 text-sm text-gray-500">Awaiting completion</p>
            </div>
          </div>
          {/* Chart visualization */}
          <div className="mt-6 rounded-lg">
            {renderChart()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;