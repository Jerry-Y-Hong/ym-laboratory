#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path
from datetime import datetime, UTC

ROOT = Path('/home/user/ym-laboratory/design-v1/mock')
TOOLS = Path('/home/user/ym-laboratory/design-v1/tools')
REPORT_MD = TOOLS / 'verification_report_latest.md'
REPORT_JSON = TOOLS / 'verification_report_latest.json'
COMMON_JS = ROOT / 'mock-common.js'

HTML_FILES = sorted(ROOT.glob('*.html'))
HTML_NAMES = {p.name for p in HTML_FILES}
COMMON_TEXT = COMMON_JS.read_text(encoding='utf-8') if COMMON_JS.exists() else ''


def exported_mock_methods(js_text: str) -> set[str]:
    m = re.search(r'window\.YMDesignMock\s*=\s*\{(.*?)\};', js_text, re.S)
    if not m:
        return set()
    body = m.group(1)
    return set(re.findall(r'\b([A-Za-z_][A-Za-z0-9_]*)\b\s*(?=,|\n|$)', body))


def local_window_functions(html_text: str) -> set[str]:
    funcs = set(re.findall(r'window\.([A-Za-z_][A-Za-z0-9_]*)\s*=\s*', html_text))
    funcs.update(re.findall(r'function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(', html_text))
    return funcs


def clickable_tab_issues(html_text: str) -> list[str]:
    issues = []
    has_common_tabs_binding = 'mock-common.js' in html_text and 'bindSimpleTabs' in COMMON_TEXT
    tabs_blocks = re.findall(r'<div class="tabs">(.*?)</div>', html_text, re.S)
    for idx, block in enumerate(tabs_blocks, start=1):
        has_span_tabs = bool(re.search(r'<span class="tab(?: active)?"', block))
        has_clickable_tabs = bool(re.search(r'<(?:button|a)[^>]*class="tab(?: active)?"', block))
        has_onclick = 'onclick=' in block
        if has_span_tabs and not has_clickable_tabs and not has_onclick and not has_common_tabs_binding:
            issues.append(f'tabs_block_{idx}: 탭이 span 기반이라 직접 클릭 전환 불가 가능성')
    return issues


MOCK_METHODS = exported_mock_methods(COMMON_TEXT)

summary = {
    'generated_at': datetime.now(UTC).isoformat().replace('+00:00', 'Z'),
    'pages_scanned': len(HTML_FILES),
    'errors': [],
    'warnings': [],
    'pages': []
}

for html in HTML_FILES:
    text = html.read_text(encoding='utf-8')
    page = {
        'file': html.name,
        'errors': [],
        'warnings': [],
        'info': {}
    }

    # basic counts
    page['info']['tabs'] = len(re.findall(r'class="tab(?: active)?"', text))
    page['info']['inputs'] = len(re.findall(r'<input|<textarea|<select', text))
    page['info']['onclicks'] = len(re.findall(r'onclick=', text))

    # file target checks: window.location, href html, data-go-after-add
    targets = []
    targets += re.findall(r"window\.location\.href='([^']+)'", text)
    targets += re.findall(r'href="([^"]+\.html(?:#[^"]+)?)"', text)
    targets += re.findall(r"href='([^']+\.html(?:#[^']+)?)'", text)
    targets += re.findall(r'data-go-after-add="([^"]+)"', text)

    for target in targets:
        file_part = target.split('#', 1)[0]
        if file_part and file_part.endswith('.html') and file_part not in HTML_NAMES:
            page['errors'].append(f'누락된 HTML 대상: {target}')

    # mock method existence
    for method in sorted(set(re.findall(r'YMDesignMock\.([A-Za-z_][A-Za-z0-9_]*)\s*\(', text))):
        if method not in MOCK_METHODS:
            page['errors'].append(f'YMDesignMock 메서드 없음: {method}()')

    # window custom calls existence in same page
    local_funcs = local_window_functions(text)
    for func in sorted(set(re.findall(r'window\.([A-Za-z_][A-Za-z0-9_]*)\s*&&\s*window\.\1\s*\(', text))):
        if func not in local_funcs:
            page['errors'].append(f'페이지 내부 window 함수 정의 없음: {func}()')

    # non-clickable tab warning
    page['warnings'].extend(clickable_tab_issues(text))

    # form controls without obvious trigger
    if page['info']['inputs'] > 0:
        has_button = bool(re.search(r'<button\b', text))
        has_form = bool(re.search(r'<form\b', text))
        if not has_button and not has_form:
            page['warnings'].append('입력 요소는 있으나 버튼/폼이 보이지 않음')

    summary['pages'].append(page)
    for err in page['errors']:
        summary['errors'].append({'file': html.name, 'message': err})
    for warn in page['warnings']:
        summary['warnings'].append({'file': html.name, 'message': warn})

# markdown report
lines = []
lines.append('# YM Mock 자동 검증 리포트')
lines.append('')
lines.append(f'- 생성 시각(UTC): {summary["generated_at"]}')
lines.append(f'- 스캔 페이지 수: {summary["pages_scanned"]}')
lines.append(f'- 오류 수: {len(summary["errors"])}')
lines.append(f'- 경고 수: {len(summary["warnings"])}')
lines.append('')

if summary['errors']:
    lines.append('## 오류')
    for item in summary['errors']:
        lines.append(f'- **{item["file"]}**: {item["message"]}')
    lines.append('')
else:
    lines.append('## 오류')
    lines.append('- 없음')
    lines.append('')

if summary['warnings']:
    lines.append('## 경고')
    for item in summary['warnings']:
        lines.append(f'- **{item["file"]}**: {item["message"]}')
    lines.append('')
else:
    lines.append('## 경고')
    lines.append('- 없음')
    lines.append('')

lines.append('## 페이지별 요약')
for page in summary['pages']:
    lines.append(
        f'- **{page["file"]}** · tabs={page["info"]["tabs"]}, inputs={page["info"]["inputs"]}, onclicks={page["info"]["onclicks"]}, '
        f'errors={len(page["errors"])}, warnings={len(page["warnings"])}'
    )

REPORT_MD.write_text('\n'.join(lines) + '\n', encoding='utf-8')
REPORT_JSON.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

print(REPORT_MD)
print(REPORT_JSON)
print(f"errors={len(summary['errors'])} warnings={len(summary['warnings'])}")
