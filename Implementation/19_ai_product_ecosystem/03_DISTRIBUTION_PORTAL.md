# Distribution Portal

> **Module**: 19_ai_product_ecosystem — Document 03  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Distribution Portal Specifications

배포 포털(Distribution Portal)은 권한이 검증된 파트너 및 고객에게 중앙 레지스트리에 보관된 제품 패키지(ZIP 번들)의 다운로드 경로를 제공하고 배포 수명 주기(Release, Rollback)를 통제하는 **보안 전송 계층**이다.

```
       [B2B Partner Portal API 호출] (Download Request)
                     │
                     ▼
       [05_LICENSING_MANAGEMENT 검증]
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
   [Validation PASS]       [Validation FAIL]
 (임시 다운로드 링크 발행)    (403 Forbidden 거부)
```

---

## 2. Secure Download Pipeline & Auth Rules (다운로드 보안 파이프라인)

- **라이선스 필수 결합**:
  - 제품 바이너리에 대한 직접 링크 제공은 원천 금지된다. 모든 다운로드 세션은 요청 헤더에 만료되지 않은 라이선스 키(`license_key`)를 담아야 포털이 파일 전송을 승인한다.
- **임시 다운로드 서명 (Signed URL)**:
  - 포털은 파일 다운로드 요청 승인 시, 최대 **5분**만 유효한 임시 서명된 다운로드 파일 토큰 링크를 동적으로 조합하여 내려준다. 시간이 경과하면 해당 링크는 자동 폭파 소멸하여 무단 외부 복제를 막는다.
- **전송 무결성 증명**:
  - 파일 다운로드 전후로 SHA-256 해시를 대조해 클라이언트 측에 받아진 번들과 레지스트리에 기록된 원본의 불일치 여부를 통보한다.

---

## 3. Distribution Response Schema (JSON)

```json
{
  "product_id": "PROD_KIMCHI_BLOG_SAAS",
  "version": "1.0.0",
  "download_session_id": "DL_SESS_20260722_001",
  "signed_download_url": "data/ready_to_publish/PROD_KIMCHI_BLOG_SAAS_1.0.0.zip?token=EXP_DATE_HERE",
  "sha256": "2f65a18a994efb70f074d0e981dfebbd8019b882361cfb7b0bd192f15ff92f15",
  "expires_at": "2026-07-22T18:14:00+09:00"
}
```
Ref: [Deployment Guide](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/18_ai_product_factory/08_DEPLOYMENT_GUIDE.md)
