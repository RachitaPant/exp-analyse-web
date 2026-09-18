import {
  AnalysisData,
  LighthouseData,
  LighthouseAudits,
  LighthouseCategories,
  PuppeteerData,
} from "@/types";

const REQUIRED_AUDITS = [
  "is-on-https",
  "first-contentful-paint",
  "largest-contentful-paint",
  "max-potential-fid",
  "speed-index",
  "interactive",
  "cumulative-layout",
  "server-response-time",
  "mainthread-work-breakdown",
];

export const transformPageSpeedData = (
  pageSpeedData: any
): Omit<AnalysisData, "url"> => {
  const lighthouseResult = pageSpeedData?.lighthouseResult || {};

  const lighthouseData = transformLighthouseData(lighthouseResult);
  const puppeteerData = generateMockPuppeteerData(lighthouseResult);

  return {
    lighthouseData,
    puppeteerData,
  };
};

const transformLighthouseData = (lighthouseResult: any): LighthouseData => {
  const audits = lighthouseResult?.audits || {};
  const categories = lighthouseResult?.categories || {};

  const transformedAudits: Partial<LighthouseAudits> = {};

  REQUIRED_AUDITS.forEach((auditKey) => {
    const audit = audits[auditKey];
    transformedAudits[auditKey as keyof LighthouseAudits] = {
      score: audit?.score ?? null,
      numericValue: audit?.numericValue ?? null,
      displayValue: audit?.displayValue ?? undefined,
    };
  });

  const transformedCategories: Partial<LighthouseCategories> = {
    performance: categories?.performance ? { score: categories.performance.score * 100 } : undefined,
    accessibility: categories?.accessibility ? { score: categories.accessibility.score * 100 } : undefined,
    "best-practices": categories?.["best-practices"]
      ? { score: categories["best-practices"].score * 100 }
      : undefined,
    seo: categories?.seo ? { score: categories.seo.score * 100 } : undefined,
  };

  return {
    audits: transformedAudits,
    categories: transformedCategories,
  };
};

const generateMockPuppeteerData = (
  lighthouseResult: any
): PuppeteerData => {
  const audits = lighthouseResult?.audits || {};

  return {
    jsExecutionTime:
      audits?.["mainthread-work-breakdown"]?.numericValue ?? null,
    cpuUsage: null,
    memoryUsage: null,
    diskIO: null,
    networkRequests: [],
    performanceMetrics: {
      fcpMs: audits?.["first-contentful-paint"]?.numericValue ?? null,
      lcpMs: audits?.["largest-contentful-paint"]?.numericValue ?? null,
      clsScore: audits?.["cumulative-layout"]?.score ?? null,
      ttfb: audits?.["server-response-time"]?.numericValue ?? null,
    },
    totalDomNodes: null,
    thirdPartyRequestsCount: null,
    resourceBreakdown: {},
    domContentLoadedTime: 0,
    largeImages: [],
    longTasks: [],
    unusedJSBytes: [],
  };
};
