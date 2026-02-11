
import React from 'react';
import { Domain } from './types';
import { Database, Search, Shield, Zap, Activity, Server, RotateCcw, Save, GraduationCap } from 'lucide-react';

export const DOMAIN_WEIGHTS: Record<Domain, number> = {
  [Domain.CRUD]: 26,
  [Domain.Indexes]: 18,
  [Domain.Security]: 15,
  [Domain.Replication]: 14,
  [Domain.ServerAdmin]: 10,
  [Domain.Monitoring]: 9,
  [Domain.Philosophy]: 7,
  [Domain.Backup]: 1,
  [Domain.Final]: 100
};

export const DOMAIN_ICONS: Record<Domain, React.ReactNode> = {
  [Domain.Philosophy]: <GraduationCap className="w-5 h-5" />,
  [Domain.CRUD]: <Database className="w-5 h-5" />,
  [Domain.Indexes]: <Search className="w-5 h-5" />,
  [Domain.ServerAdmin]: <Server className="w-5 h-5" />,
  [Domain.Monitoring]: <Activity className="w-5 h-5" />,
  [Domain.Security]: <Shield className="w-5 h-5" />,
  [Domain.Replication]: <Zap className="w-5 h-5" />,
  [Domain.Backup]: <Save className="w-5 h-5" />,
  [Domain.Final]: <RotateCcw className="w-5 h-5" />
};

export const DOMAIN_DESCRIPTIONS: Record<Domain, string> = {
  [Domain.Philosophy]: "Core architecture and RDBMS differences.",
  [Domain.CRUD]: "Complex queries, aggregations, and updates.",
  [Domain.Indexes]: "Query optimization and plan analysis.",
  [Domain.ServerAdmin]: "Instance management and mongosh usage.",
  [Domain.Monitoring]: "Performance tracking and operations.",
  [Domain.Security]: "Authentication, authorization, and RBAC.",
  [Domain.Replication]: "Availability, elections, and failover.",
  [Domain.Backup]: "Disaster recovery and backup strategies.",
  [Domain.Final]: "Full 66-question simulation."
};
