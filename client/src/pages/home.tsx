import { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import DataTable from "@/components/DataTable";
import EmailModal from "@/components/EmailModal";
import KPICard from "@/components/KPICard";
import ChartCard from "@/components/ChartCard";
import RecentActivities from "@/components/RecentActivities";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import config from '../config.json';
import {
  Wand2,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Mail,
  Download,
  RotateCcw,
  LayoutDashboard,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ViewMode = "input" | "report" | "dashboard";
type FeedbackState = null | "yes" | "no";

interface Activity {
  id: string;
  query: string;
  action: "Dashboard" | "Report";
  timestamp: Date;
}

export default function Home() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("input");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [improvementText, setImprovementText] = useState("");
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentReportTitle, setCurrentReportTitle] = useState("");
  const [reportData, setReportData] = useState<any[]>([]);
  const [reportColumns, setReportColumns] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [reportHeaderText, setReportHeaderText] = useState<string>("");


  const parseTableFromText = (text: string) => {
    const lines = text.split("\n");
    const tableLines = lines.filter((line) => line.includes("|"));

    // Extract text before the table
    const firstTableLineIndex = lines.findIndex((line) => line.includes("|"));
    const headerText =
      firstTableLineIndex > 0
        ? lines.slice(0, firstTableLineIndex).join("\n").trim()
        : "";

    if (tableLines.length < 2) return { columns: [], data: [], headerText };

    // Parse header
    const headerLine = tableLines[0];
    const headers = headerLine
      .split("|")
      .map((h) => h.trim())
      .filter((h) => h);

    // Skip separator line (index 1)
    // Parse data rows
    const dataRows = tableLines.slice(2).map((line) => {
      const values = line
        .split("|")
        .map((v) => v.trim())
        .filter((v) => v);
      const row: any = {};
      headers.forEach((header, index) => {
        const key = header.toLowerCase().replace(/\s+/g, "_");
        row[key] = values[index] || "";
      });
      return row;
    });

    // Create columns configuration
    const columns = headers.map((header) => ({
      key: header.toLowerCase().replace(/\s+/g, "_"),
      label: header,
      align: "left" as const,
    }));

    return { columns, data: dataRows, headerText };
  };

  const loadReportData = async () => {
    setIsLoadingData(true);
    try {
      const response = await fetch("/StaticData/responseData.json");
      const jsonData = await response.json();

      if (jsonData.parts && jsonData.parts[0] && jsonData.parts[0].text) {
        const { columns, data, headerText } = parseTableFromText(
          jsonData.parts[0].text,
        );
        setReportColumns(columns);
        setReportData(data);
        setReportHeaderText(headerText);
      }
    } catch (error) {
      console.error("Error loading report data:", error);
      toast({
        title: "Error loading data",
        description: "Failed to load report data from JSON file.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const dashboardBarData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 4500 },
    { name: "May", value: 6000 },
    { name: "Jun", value: 5500 },
  ];

  const dashboardPieData = [
    { name: "Electronics", value: 400 },
    { name: "Clothing", value: 300 },
    { name: "Food", value: 200 },
    { name: "Books", value: 100 },
  ];

  const handleGenerateReport = () => {
    console.log("Generate Report triggered", query);
    const title = query || "Booking List - Last Month";
    setCurrentReportTitle(title);
    loadReportData();
    setViewMode("report");
    setFeedback(null);
    setImprovementText("");
    addActivity(query || "Show me the booking list for last month", "Report");
  };

  const handleGenerateDashboard = () => {
    console.log("Generate Dashboard triggered", query);
    setCurrentReportTitle(query || "Sales Dashboard - November 2025");
    setViewMode("dashboard");
    setFeedback(null);
    setImprovementText("");
    addActivity(query || "Create a sales dashboard", "Dashboard");
  };

  const handleFeedbackYes = () => {
    console.log("Feedback: Yes");
    setFeedback("yes");
  };

  const handleFeedbackNo = () => {
    console.log("Feedback: No");
    setFeedback("no");
  };

  const handleChangeVote = () => {
    console.log("Change vote triggered");
    setFeedback(null);
    setImprovementText("");
  };

  const handleStartFresh = () => {
    console.log("Start fresh triggered");
    setViewMode("input");
    setQuery("");
    setFeedback(null);
    setImprovementText("");
  };

  const handleDownload = () => {
    console.log("Download triggered");
    toast({
      title: "Download started",
      description: "Your report is being downloaded as an Excel file.",
    });
  };

  const handleRefineReport = () => {
    console.log("Refine report triggered", improvementText);
    toast({
      title: "Report refinement submitted",
      description: "We'll use your feedback to improve the report.",
    });
    setFeedback(null);
    setImprovementText("");
  };

  const addActivity = (userQuery: string, action: "Dashboard" | "Report") => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      query: userQuery,
      action,
      timestamp: new Date(),
    };
    setActivities((prev) => [newActivity, ...prev].slice(0, 10));
  };

  const handleActivityClick = (activity: Activity) => {
    setQuery(activity.query);
    if (activity.action === "Report") {
      handleGenerateReport();
    } else {
      handleGenerateDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex min-h-screen">
        {/* Left Sidebar - Recent Activities (30%) - Only show on input mode */}
        {config?.isRecentActivity && activities.length > 0 && viewMode === "input" && (
          <div className="hidden lg:block w-[30%] border-r border-border/50 sticky top-0 h-screen overflow-y-auto">
            <div className="p-6">
              <RecentActivities
                activities={activities}
                onActivityClick={handleActivityClick}
              />
            </div>
          </div>
        )}

        {/* Main Content Area (70% or 100% if no activities) */}
        <div
          className={`flex-1 ${activities.length > 0 && viewMode === "input" ? "lg:w-[70%]" : "w-full"} overflow-y-auto`}
        >
          <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 md:px-8 lg:px-12">
            {viewMode === "input" && (
              <>
                {/* Header - Center Aligned - Only on Landing Page */}
                <div className="flex flex-col items-center mb-10 md:mb-12 text-center">
                  <Logo />
                  <p className="text-sm text-muted-foreground mt-4 max-w-2xl px-4">
                    Transform your data into actionable insights with AI-powered
                    analytics
                  </p>
                </div>
              </>
            )}

            {viewMode === "input" && (
              <div className="space-y-6 md:space-y-8">
                <Card className="shadow-lg border-border/50 hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-3 text-primary">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Wand2 className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <h2 className="text-base font-semibold">
                          Ask me anything
                        </h2>
                        <p className="text-xs text-muted-foreground mt-1">
                          Generate reports, build dashboards, and analyze your
                          data
                        </p>
                      </div>
                    </div>

                    <Textarea
                      placeholder="e.g., 'Show me the top 10 selling products this month' or 'Create a sales performance dashboard'"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="min-h-32 md:min-h-36 resize-none text-sm placeholder:text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                      data-testid="input-query"
                    />

                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                      <Button
                        variant="outline"
                        onClick={handleGenerateReport}
                        data-testid="button-generate-report"
                        className="w-full sm:w-auto border-2 hover:bg-accent/50 transition-all"
                        size="lg"
                        disabled={!query.trim()}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Report
                      </Button>
                      <Button
                        onClick={handleGenerateDashboard}
                        data-testid="button-generate-dashboard"
                        className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all"
                        size="lg"
                        disabled={!query.trim()}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Generate Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {viewMode === "report" && (
              <div className="space-y-6">
                {/* Compact Header with Back Button and Logo */}
                <div className="flex items-start gap-3 pb-4 border-b border-border/50">
                  <Button
                    variant="ghost"
                    onClick={handleStartFresh}
                    className="p-2 h-auto hover:bg-accent/50 rounded-lg mt-0.5"
                    data-testid="button-back-to-home"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </Button>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-md">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-lg font-semibold">AURA</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      AI Analytics Platform
                    </p>
                  </div>
                </div>

                {isLoadingData ? (
                  <Card className="shadow-lg border-border/50">
                    <CardContent className="p-8 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="text-muted-foreground">
                          Loading report data...
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <DataTable
                      title={currentReportTitle}
                      subtitle={reportHeaderText}
                      columns={reportColumns}
                      data={reportData}
                    />
                  </>
                )}

                {feedback === null && (
                  <Card className="mx-auto shadow-lg border-border/50 overflow-hidden">
                    <CardContent className="flex items-center justify-between bg-[#f8fafd] dark:bg-[#1c1c1c] px-4 py-3 rounded-xl shadow-sm">
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <p className="font-medium">Does this help?</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleFeedbackYes}
                          className="w-8 h-8 border hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900 transition-all"
                          data-testid="button-feedback-yes"
                        >
                          <ThumbsUp className="w-4 h-4 text-gray-600 group-hover:text-green-600 transition-colors" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleFeedbackNo}
                          className="w-8 h-8 border hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900 transition-all"
                          data-testid="button-feedback-no"
                        >
                          <ThumbsDown className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-colors" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {feedback === "yes" && (
                  <Card className=" mx-auto shadow-lg border-border/50">
                    <CardContent className="space-y-6 py-8 px-6">
                      <div className="flex items-center justify-between w-full text-green-600 dark:text-green-400">
                        {/* Left Section */}
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="w-5 h-5" />
                          <p className="text-sm md:text-base font-semibold">
                            Great! What would you like to do next?
                          </p>
                        </div>

                        {/* Right Section (Change Vote Button) */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleChangeVote}
                          data-testid="button-change-vote"
                          className="text-muted-foreground hover:text-foreground flex items-center"
                        >
                          <RotateCcw className="w-3 h-3 mr-2" />
                          Change vote
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <Button
                          onClick={() => setEmailModalOpen(true)}
                          data-testid="button-email-report"
                          className="shadow-md hover:shadow-lg transition-all"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Email Report
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleDownload}
                          data-testid="button-download-report"
                          className="border-2 hover:bg-accent/50 transition-all"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download (.xlsx)
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleStartFresh}
                          data-testid="button-start-fresh"
                          className="border-2 hover:bg-accent/50 transition-all sm:col-span-2 lg:col-span-1"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Start Fresh
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {feedback === "no" && (
                  <Card className="mx-auto shadow-lg border-border/50">
                    <CardContent className="space-y-6 py-8 px-6">
                      <div className="flex items-center justify-between w-full text-amber-600 dark:text-amber-400">
                        {/* Left Section */}
                        <div className="flex items-center gap-2">
                          <ThumbsDown className="w-5 h-5" />
                          <p className="text-sm md:text-base font-semibold">
                            Sorry, this wasn’t helpful. How can we improve it?
                          </p>
                        </div>

                        {/* Right Section (Change Vote Button) */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleChangeVote}
                          data-testid="button-change-vote-no"
                          className="text-muted-foreground hover:text-foreground flex items-center"
                        >
                          <RotateCcw className="w-3 h-3 mr-2" />
                          Change vote
                        </Button>
                      </div>
                      <Textarea
                        placeholder="e.g., 'Include a column for customer location' or 'Show the top 50 records instead'"
                        value={improvementText}
                        onChange={(e) => setImprovementText(e.target.value)}
                        className="min-h-32 resize-vertical focus:ring-2 focus:ring-primary/20 transition-all"
                        data-testid="textarea-improvement"
                      />
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          variant="outline"
                          onClick={handleStartFresh}
                          data-testid="button-start-fresh-no"
                          className="border-2 hover:bg-accent/50 transition-all"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Start Fresh
                        </Button>
                        <Button
                          onClick={handleRefineReport}
                          disabled={!improvementText}
                          data-testid="button-refine-report"
                          className="shadow-md hover:shadow-lg transition-all"
                        >
                          <Wand2 className="w-4 h-4 mr-2" />
                          Refine Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {viewMode === "dashboard" && (
              <div className="space-y-6">
                {/* Compact Header with Back Button and Logo */}
                <div className="flex items-start justify-between pb-4 border-b border-border/50">
                  <div className="flex items-start gap-3">
                    <Button
                      variant="ghost"
                      onClick={handleStartFresh}
                      className="p-2 h-auto hover:bg-accent/50 rounded-lg mt-0.5"
                      data-testid="button-back-to-input"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                      >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                    </Button>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-md">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-semibold">AURA</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        AI Analytics Platform
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {currentReportTitle}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Real-time insights and analytics
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  <KPICard
                    title="Total Sales"
                    value="$125,430"
                    icon={DollarSign}
                    trend={{ value: "12.5%", isPositive: true }}
                  />
                  <KPICard
                    title="Active Users"
                    value="8,549"
                    icon={Users}
                    trend={{ value: "8.2%", isPositive: true }}
                  />
                  <KPICard
                    title="Total Orders"
                    value="1,234"
                    icon={ShoppingCart}
                    trend={{ value: "3.1%", isPositive: false }}
                  />
                  <KPICard
                    title="Growth Rate"
                    value="23.5%"
                    icon={TrendingUp}
                    trend={{ value: "5.4%", isPositive: true }}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  <ChartCard
                    title="Monthly Sales Trend"
                    type="bar"
                    data={dashboardBarData}
                  />
                  <ChartCard
                    title="Sales by Category"
                    type="pie"
                    data={dashboardPieData}
                  />
                </div>

                <DataTable
                  title="Detailed Sales Data"
                  subtitle="Last 10 transactions"
                  columns={reportColumns}
                  data={reportData}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <EmailModal
        open={emailModalOpen}
        onOpenChange={setEmailModalOpen}
        reportTitle={currentReportTitle}
      />
    </div>
  );
}
