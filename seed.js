import { faker } from "@faker-js/faker";
import { writeFileSync } from "fs";

// Configuration
const NUM_LOGS = 500;
const NUM_SERVICES = 20;
const NUM_ALERTS = 100;
const NUM_METRICS = 1000;

const CONFIG = {
  pagination: {
    defaultLimit: 25,
    maxLimit: 100,
  },
  filters: {
    cloudProviders: ["AWS", "Azure"],
    logLevels: ["ERROR", "WARN", "INFO", "DEBUG"],
    environments: ["production", "staging", "development"],
    serviceTypes: [
      "EC2",
      "Lambda",
      "S3",
      "RDS",
      "Azure VM",
      "Azure Functions",
      "Azure Storage",
      "Azure SQL",
      "API Gateway",
      "Load Balancer",
    ],
    regions: {
      AWS: ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"],
      Azure: ["eastus", "westeurope", "southeastasia", "northeurope"],
    },
    metricNames: [
      "CPUUtilization",
      "MemoryUtilization",
      "NetworkIn",
      "NetworkOut",
      "DiskReadOps",
      "DiskWriteOps",
      "ResponseTime",
      "RequestCount",
      "ErrorRate",
      "DatabaseConnections",
    ],
    alertSeverities: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
    alertStatuses: ["ACTIVE", "ACKNOWLEDGED", "RESOLVED"],
    tags: [
      "critical",
      "performance",
      "security",
      "network",
      "database",
      "auth",
    ],
  },
};

const generateResourceId = (cloud) => {
  return cloud === "AWS"
    ? `i-${faker.string.alphanumeric({ length: 17 }).toLowerCase()}`
    : `vm-${faker.string.alphanumeric({ length: 8 }).toLowerCase()}`;
};

// Generate services first so we can reference them
const generateServices = (count) => {
  const serviceNames = [
    "payment-service",
    "user-auth",
    "inventory-manager",
    "notification-service",
    "order-processing",
    "data-analytics",
    "search-service",
    "email-service",
    "logging-service",
    "monitoring-service",
  ];

  return Array.from({ length: count }, (_, index) => {
    const cloud = faker.helpers.arrayElement(CONFIG.filters.cloudProviders);
    const name = faker.helpers.arrayElement(serviceNames);

    return {
      id: (index + 1).toString(),
      name,
      type: faker.helpers.arrayElement(CONFIG.filters.serviceTypes),
      cloud,
      region: faker.helpers.arrayElement(CONFIG.filters.regions[cloud]),
      status: faker.helpers.arrayElement(["ACTIVE", "MAINTENANCE", "DEGRADED"]),
      version: faker.system.semver(),
      owner: faker.person.fullName(),
      team: faker.helpers.arrayElement([
        "Platform",
        "Infrastructure",
        "Security",
        "DevOps",
      ]),
      created: faker.date.past({ years: 2 }).toISOString(),
      updated: faker.date.recent({ days: 30 }).toISOString(),
    };
  });
};

const generateLogs = (count, services) => {
  return Array.from({ length: count }, (_, index) => {
    const service = faker.helpers.arrayElement(services);
    const level = faker.helpers.arrayElement(CONFIG.filters.logLevels);
    const timestamp = faker.date.recent({ days: 7 });

    return {
      id: (index + 1).toString(),
      timestamp: timestamp.toISOString(),
      service: service.name,
      environment: faker.helpers.arrayElement(CONFIG.filters.environments),
      cloud: service.cloud,
      region: service.region,
      level,
      message: faker.helpers.arrayElement([
        "Connection timeout in database query",
        "API rate limit exceeded",
        "Memory usage above threshold",
        "Failed to process payment transaction",
        "Security group modification detected",
        "Container health check failed",
        "Service auto-scaling event triggered",
        "SSL certificate expiration warning",
        "Database backup completion status",
        "User authentication failure detected",
      ]),
      resourceId: generateResourceId(service.cloud),
      resourceType: service.type,
      metrics: {
        cpu: faker.number.int({ min: 0, max: 100 }),
        memory: faker.number.int({ min: 0, max: 100 }),
        latency: faker.number.int({ min: 10, max: 5000 }),
      },
      tags: faker.helpers.arrayElements(CONFIG.filters.tags, {
        min: 1,
        max: 3,
      }),
      traceId: faker.string.uuid(),
      userId: faker.string.uuid(),
      metadata: {
        requestId: faker.string.uuid(),
        ip: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
      },
      searchText: function () {
        return `${this.service} ${this.message} ${this.level} ${this.environment}`;
      },
    };
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const generateAlerts = (count, services) => {
  return Array.from({ length: count }, (_, index) => {
    const service = faker.helpers.arrayElement(services);
    const resourceId = generateResourceId(service.cloud);

    return {
      id: (index + 1).toString(),
      severity: faker.helpers.arrayElement([
        "CRITICAL",
        "HIGH",
        "MEDIUM",
        "LOW",
      ]),
      status: faker.helpers.arrayElement([
        "ACTIVE",
        "ACKNOWLEDGED",
        "RESOLVED",
      ]),
      message: faker.helpers.arrayElement([
        "High CPU utilization detected",
        "Memory usage exceeded threshold",
        "Disk space running low",
        "High error rate detected",
        "Service response time degradation",
        "Database connection pool exhausted",
        "Network latency spike detected",
        "API endpoint timeout increased",
      ]),
      triggeredAt: faker.date.recent({ days: 3 }).toISOString(),
      resourceId,
      service: service.name,
      cloud: service.cloud,
      region: service.region,
      assignedTo: faker.person.fullName(),
      acknowledgedAt: faker.date.recent({ days: 1 }).toISOString(),
      resolvedAt: null,
      metadata: {
        thresholdValue: faker.number.int({ min: 80, max: 100 }),
        currentValue: faker.number.int({ min: 85, max: 100 }),
        duration: faker.number.int({ min: 5, max: 30 }),
      },
    };
  });
};

const generateMetrics = (count, services) => {
  return Array.from({ length: count }, (_, index) => {
    const service = faker.helpers.arrayElement(services);
    const resourceId = generateResourceId(service.cloud);
    const metricName = faker.helpers.arrayElement(CONFIG.filters.metricNames);

    let value, unit;
    switch (metricName) {
      case "CPUUtilization":
      case "MemoryUtilization":
      case "ErrorRate":
        value = faker.number.float({ min: 0, max: 100, precision: 0.01 });
        unit = "Percent";
        break;
      case "ResponseTime":
        value = faker.number.float({ min: 10, max: 5000, precision: 0.1 });
        unit = "Milliseconds";
        break;
      case "RequestCount":
      case "DatabaseConnections":
        value = faker.number.int({ min: 0, max: 10000 });
        unit = "Count";
        break;
      default:
        value = faker.number.float({ min: 0, max: 1000000, precision: 0.1 });
        unit = "Bytes";
    }

    return {
      id: (index + 1).toString(),
      resourceId,
      timestamp: faker.date.recent({ days: 1 }).toISOString(),
      name: metricName,
      value,
      unit,
      service: service.name,
      cloud: service.cloud,
      region: service.region,
      dimensions: {
        ServiceName: service.name,
        InstanceId: resourceId,
        Environment: faker.helpers.arrayElement([
          "production",
          "staging",
          "development",
        ]),
      },
    };
  });
};

// Generate the data
const services = generateServices(NUM_SERVICES);
const logs = generateLogs(NUM_LOGS, services);
const alerts = generateAlerts(NUM_ALERTS, services);
const metrics = generateMetrics(NUM_METRICS, services);

const db = {
  services: services,
  logs: logs,
  alerts: alerts,
  metrics: metrics,
  metadata: {
    version: "1.0",
    generated: new Date().toISOString(),
    pagination: CONFIG.pagination,
    filters: CONFIG.filters,
    collections: {
      services: {
        total: services.length,
        sortFields: ["name", "type", "status"],
        filterableFields: ["cloud", "region", "status", "team"],
      },
      logs: {
        total: logs.length,
        sortFields: ["timestamp", "level", "service"],
        filterableFields: [
          "level",
          "service",
          "environment",
          "cloud",
          "region",
        ],
        searchableFields: ["message", "resourceId"],
      },
      alerts: {
        total: alerts.length,
        sortFields: ["triggeredAt", "severity", "status"],
        filterableFields: ["severity", "status", "service", "cloud", "region"],
        searchableFields: ["message", "resourceId"],
      },
      metrics: {
        total: metrics.length,
        sortFields: ["timestamp", "name", "value"],
        filterableFields: ["name", "service", "cloud", "region", "unit"],
        aggregations: ["avg", "max", "min", "sum", "count"],
      },
    },
  },
};

// Write to file
writeFileSync("db.json", JSON.stringify(db, null, 2), "utf-8");

console.log("Data generation completed!");
console.log(`Generated:`);
console.log(`- ${NUM_SERVICES} services`);
console.log(`- ${NUM_LOGS} logs`);
console.log(`- ${NUM_ALERTS} alerts`);
console.log(`- ${NUM_METRICS} metrics`);
