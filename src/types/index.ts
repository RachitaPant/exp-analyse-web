export interface LighthouseAudit {
  score?: number | null;
  numericValue?: number | null;
  displayValue?: string;
}

export interface LighthouseAudits {
  "is-on-https": LighthouseAudit;
  "first-contentful-paint": LighthouseAudit;
  "largest-contentful-paint": LighthouseAudit;
  "max-potential-fid": LighthouseAudit;
  "speed-index": LighthouseAudit;
  interactive: LighthouseAudit;
  "cumulative-layout": LighthouseAudit;
  "server-response-time": LighthouseAudit;
  "mainthread-work-breakdown": LighthouseAudit;
}

export interface LighthouseCategories {
  performance?: { score: number };
  accessibility?: { score: number };
  "best-practices"?: { score: number };
  seo?: { score: number };
}

export interface LighthouseData {
  audits?: Partial<LighthouseAudits>;
  categories?: Partial<LighthouseCategories>;
}

export interface PuppeteerData {
  jsExecutionTime?: number | null;
  cpuUsage?: number | null;
  memoryUsage?: number | null;
  diskIO?: number | null;
  networkRequests?: string[];
  performanceMetrics?: Record<string, unknown>;
  totalDomNodes?: number;
  thirdPartyRequestsCount?: number;
  resourceBreakdown?: Record<string, number>;
  domContentLoadedTime?: number | 0;
  largeImages?: { src: string; width: number; height: number }[];
  longTasks?: { name: string; startTime: number; duration: number }[];
  unusedJSBytes?: {
    name: string;
    transferSize: number;
    encodedBodySize: number;
  }[];
}

export interface AnalysisData {
  puppeteerData?: PuppeteerData;
  lighthouseData?: LighthouseData;
  url?: string;
}

export interface AnalyzeRequest {
  url: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  statusCode: number;
}
