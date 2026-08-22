import { describe, it, expect, beforeEach } from 'vitest';
import { reportStorage } from '../frontend/src/services/reportStorage';

describe('Clinical Report Storage Abstraction Layer', () => {
  beforeEach(() => {
    reportStorage.clearReports();
  });

  it('TEST 1: Retrieves seeded reports on first initialization', () => {
    const reports = reportStorage.getReports();
    expect(Array.isArray(reports)).toBe(true);
    expect(reports.length).toBeGreaterThanOrEqual(1);
    expect(reports[0].id).toBe('report_demo_001');
    expect(reports[0].patient.name).toBe('Aarav Sharma');
  });

  it('TEST 2: Saves a new patient assessment snapshot with unique ID and versioning', () => {
    const snapshot = {
      patient: { name: 'Priya Patel', age: 31, diagnosis: 'Type 1 Diabetes' },
      clinicalParameters: { glucose: 145, glucoseTrend: 'rising', activeInsulin: 1.5, icr: '1:12', targetRange: '70-140' },
      meal: { description: 'Masala Dosa with Sambar', estimatedCarbs: 52 },
      prediction: { forecast30Min: 160, riskScore: 22, riskLevel: 'LOW' }
    };

    const saved = reportStorage.saveReport(snapshot);

    expect(saved.id).toBeDefined();
    expect(saved.id.startsWith('report_')).toBe(true);
    expect(saved.reportVersion).toBe('1.0');
    expect(saved.createdAt).toBeDefined();

    const allReports = reportStorage.getReports();
    expect(allReports.length).toBe(2);
    expect(allReports[0].patient.name).toBe('Priya Patel');
  });

  it('TEST 3: Retrieves a specific report by ID', () => {
    const snapshot = {
      id: 'report_custom_123',
      patient: { name: 'Rajesh Kumar', age: 45, diagnosis: 'Type 1 Diabetes' },
      clinicalParameters: { glucose: 65, activeInsulin: 2.0 },
      prediction: { riskLevel: 'HIGH', riskScore: 85 }
    };

    reportStorage.saveReport(snapshot);
    const retrieved = reportStorage.getReportById('report_custom_123');

    expect(retrieved).not.toBeNull();
    expect(retrieved?.patient.name).toBe('Rajesh Kumar');
    expect(retrieved?.prediction.riskLevel).toBe('HIGH');
  });

  it('TEST 4: Deletes a specific report without affecting other saved records', () => {
    const repA = reportStorage.saveReport({
      id: 'report_to_delete',
      patient: { name: 'Patient A' },
      clinicalParameters: { glucose: 100 }
    });

    const repB = reportStorage.saveReport({
      id: 'report_to_keep',
      patient: { name: 'Patient B' },
      clinicalParameters: { glucose: 110 }
    });

    const afterDelete = reportStorage.deleteReport('report_to_delete');
    expect(afterDelete.some(r => r.id === 'report_to_delete')).toBe(false);
    expect(afterDelete.some(r => r.id === 'report_to_keep')).toBe(true);
  });
});
