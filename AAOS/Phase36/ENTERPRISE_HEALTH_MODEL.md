# Enterprise Health Model

## Scoring Overview
The Enterprise Health Model aggregates the domain scores from all Board Review Agents into a single **Enterprise Health Score** (0‑100). The model uses weighted averaging to reflect the relative importance of each domain.

### Weighting Scheme
| Domain | Weight |
|--------|--------|
| Risk | 0.15 |
| Policy | 0.12 |
| Security | 0.18 |
| Finance | 0.10 |
| Strategy | 0.12 |
| Performance | 0.13 |
| Resource | 0.10 |
| Compliance | 0.10 |

### Calculation
```python
enterprise_health = (
    risk_score * 0.15 +
    policy_score * 0.12 +
    security_score * 0.18 +
    finance_score * 0.10 +
    strategy_score * 0.12 +
    performance_score * 0.13 +
    resource_score * 0.10 +
    compliance_score * 0.10
)
```
All scores are normalized to 0‑100 before weighting.

## Example Scores
```
Risk Score          : 82
Policy Score        : 97
Security Score      : 99
Finance Score       : 63
Strategy Score      : 91
Performance Score   : 88
Resource Score      : 93
Compliance Score    : 95
```
**Enterprise Health** = 86 (rounded)

## Health Status Classification
| Health Score Range | Status |
|--------------------|--------|
| 90‑100 | Excellent |
| 75‑89  | Healthy |
| 60‑74  | Warning |
| <60    | Critical |

## Usage
- The **Board Early Warning Engine** monitors the enterprise health score in real‑time.
- Threshold breaches trigger alerts and escalation according to the **Escalation Framework**.
- Scores are stored as immutable time‑series entries for audit and trend analysis.

---
*This document defines the quantitative model used by AEBMS to assess overall enterprise health.*
