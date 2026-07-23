import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
SYS_DIR = os.path.join(ROOT_DIR, 'Implementation', '20_ai_developer_platform')

print("============================================================")
print("  YM-LAB PROJECT AI Developer Platform Verification Check")
print("============================================================")

required_docs = [
    os.path.join(SYS_DIR, '01_PLATFORM_ARCHITECTURE.md'),
    os.path.join(SYS_DIR, '02_DEVELOPER_EXPERIENCE.md'),
    os.path.join(SYS_DIR, '03_SDK_ARCHITECTURE.md'),
    os.path.join(SYS_DIR, '04_CLI_SYSTEM.md'),
    os.path.join(SYS_DIR, '05_TEMPLATE_ENGINE.md'),
    os.path.join(SYS_DIR, '06_PROJECT_GENERATOR.md'),
    os.path.join(SYS_DIR, '07_PLUGIN_FRAMEWORK.md'),
    os.path.join(SYS_DIR, '08_EXTENSION_SYSTEM.md'),
    os.path.join(SYS_DIR, '09_LOCAL_RUNTIME.md'),
    os.path.join(SYS_DIR, '10_CONFIGURATION_SYSTEM.md'),
    os.path.join(SYS_DIR, '11_DEBUGGING_SYSTEM.md'),
    os.path.join(SYS_DIR, '12_LOGGING_FRAMEWORK.md'),
    os.path.join(SYS_DIR, '13_TESTING_FRAMEWORK.md'),
    os.path.join(SYS_DIR, '14_MOCK_SERVER.md'),
    os.path.join(SYS_DIR, '15_API_SIMULATOR.md'),
    os.path.join(SYS_DIR, '16_PACKAGE_MANAGER.md'),
    os.path.join(SYS_DIR, '17_VERSION_MANAGER.md'),
    os.path.join(SYS_DIR, '18_BUILD_PIPELINE.md'),
    os.path.join(SYS_DIR, '19_DEV_CONTAINER.md'),
    os.path.join(SYS_DIR, '20_DOCKER_ENVIRONMENT.md'),
    os.path.join(SYS_DIR, '21_CODE_STYLE_GUIDE.md'),
    os.path.join(SYS_DIR, '22_PROJECT_STRUCTURE_GUIDE.md'),
    os.path.join(SYS_DIR, '23_SAMPLE_PROJECT.md'),
    os.path.join(SYS_DIR, '24_DEVELOPER_DOCUMENTATION.md'),
    os.path.join(SYS_DIR, '25_VALIDATION_SYSTEM.md'),
    os.path.join(SYS_DIR, '26_SELF_REVIEW.md'),
    os.path.join(SYS_DIR, '27_PHASE20_COMPLETION_REPORT.md'),
    os.path.join(SYS_DIR, 'README.md'),
]

results = {
    "1. Platform Documents Exist": "PASS",
    "2. Platform Architecture (01_PLATFORM_ARCHITECTURE)": "PASS",
    "3. DX Guidelines (02_DEVELOPER_EXPERIENCE)": "PASS",
    "4. SDK Architecture (03_SDK_ARCHITECTURE)": "PASS",
    "5. CLI System Spec (04_CLI_SYSTEM)": "PASS",
    "6. Template Engine Spec (05_TEMPLATE_ENGINE)": "PASS",
    "7. Project Generator Spec (06_PROJECT_GENERATOR)": "PASS",
    "8. Plugin Framework Spec (07_PLUGIN_FRAMEWORK)": "PASS",
    "9. Extension System Spec (08_EXTENSION_SYSTEM)": "PASS",
    "10. Local Runtime (09_LOCAL_RUNTIME)": "PASS",
    "11. Config System Spec (10_CONFIGURATION_SYSTEM)": "PASS",
    "12. Debugging Spec (11_DEBUGGING_SYSTEM)": "PASS",
    "13. Logging Framework (12_LOGGING_FRAMEWORK)": "PASS",
    "14. Testing Framework (13_TESTING_FRAMEWORK)": "PASS",
    "15. Mock Server (14_MOCK_SERVER)": "PASS",
    "16. API Simulator (15_API_SIMULATOR)": "PASS",
    "17. Package Manager (16_PACKAGE_MANAGER)": "PASS",
    "18. Version Manager (17_VERSION_MANAGER)": "PASS",
    "19. Build Pipeline (18_BUILD_PIPELINE)": "PASS",
    "20. Dev Container (19_DEV_CONTAINER)": "PASS",
    "21. Docker Environment (20_DOCKER_ENVIRONMENT)": "PASS",
    "22. Code Style Guide (21_CODE_STYLE_GUIDE)": "PASS",
    "23. Structure Guide (22_PROJECT_STRUCTURE_GUIDE)": "PASS",
    "24. Sample Project Spec (23_SAMPLE_PROJECT)": "PASS",
    "25. Documentation Spec (24_DEVELOPER_DOCUMENTATION)": "PASS",
    "26. Validation Spec (25_VALIDATION_SYSTEM)": "PASS",
    "27. Self Review Check (26_SELF_REVIEW)": "PASS",
    "28. Final Completion Report (27_PHASE20_COMPLETION_REPORT)": "PASS"
}

errors = []

# Check 1: Existence of all required docs
if not os.path.isdir(SYS_DIR):
    results["1. Platform Documents Exist"] = "FAIL"
    errors.append("Developer Platform directory missing: Implementation/20_ai_developer_platform/")

for path in required_docs:
    fname = os.path.basename(path)
    if not os.path.exists(path):
        results["1. Platform Documents Exist"] = "FAIL"
        errors.append(f"Missing deliverable file: {fname}")
    else:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            if len(content) == 0:
                results["1. Platform Documents Exist"] = "FAIL"
                errors.append(f"Deliverable file is empty: {fname}")

# Check 2: Architecture
doc_path = os.path.join(SYS_DIR, '01_PLATFORM_ARCHITECTURE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Developer Portal", "SDK", "CLI", "TEMPLATE_ENGINE", "The operating framework must remain stable"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["2. Platform Architecture (01_PLATFORM_ARCHITECTURE)"] = "FAIL"
        errors.append(f"01_PLATFORM_ARCHITECTURE.md missing keywords: {missing}")

# Check 3: DX
doc_path = os.path.join(SYS_DIR, '02_DEVELOPER_EXPERIENCE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Developer Experience", "ymlab-cli", "Onboarding", "telemetry"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["3. DX Guidelines (02_DEVELOPER_EXPERIENCE)"] = "FAIL"
        errors.append(f"02_DEVELOPER_EXPERIENCE.md missing keywords: {missing}")

# Check 4: SDK
doc_path = os.path.join(SYS_DIR, '03_SDK_ARCHITECTURE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["ymlab SDK", "SafeDBConnector", "BaseAgent", "EcosystemClient"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["4. SDK Architecture (03_SDK_ARCHITECTURE)"] = "FAIL"
        errors.append(f"03_SDK_ARCHITECTURE.md missing keywords: {missing}")

# Check 5: CLI
doc_path = os.path.join(SYS_DIR, '04_CLI_SYSTEM.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["ymlab-cli", "init", "verify", "run", "package", "exit 0"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["5. CLI System Spec (04_CLI_SYSTEM)"] = "FAIL"
        errors.append(f"04_CLI_SYSTEM.md missing keywords: {missing}")

# Check 6: Template
doc_path = os.path.join(SYS_DIR, '05_TEMPLATE_ENGINE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["{{product_id}}", "{{q_code}}", "YMLabTemplateRenderer", "render_file"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["6. Template Engine Spec (05_TEMPLATE_ENGINE)"] = "FAIL"
        errors.append(f"05_TEMPLATE_ENGINE.md missing keywords: {missing}")

# Check 7: Generator
doc_path = os.path.join(SYS_DIR, '06_PROJECT_GENERATOR.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["ymlab-cli init", "platform_libs", "run.py"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["7. Project Generator Spec (06_PROJECT_GENERATOR)"] = "FAIL"
        errors.append(f"06_PROJECT_GENERATOR.md missing keywords: {missing}")

# Check 8: Plugin
doc_path = os.path.join(SYS_DIR, '07_PLUGIN_FRAMEWORK.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["BaseYMLabAgent", "execute", "CustomSEOAgent", "plugins.json"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["8. Plugin Framework Spec (07_PLUGIN_FRAMEWORK)"] = "FAIL"
        errors.append(f"07_PLUGIN_FRAMEWORK.md missing keywords: {missing}")

# Check 9: Extension
doc_path = os.path.join(SYS_DIR, '08_EXTENSION_SYSTEM.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["media_encoder_hook", "YMLabExtensionManager", "hook"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["9. Extension System Spec (08_EXTENSION_SYSTEM)"] = "FAIL"
        errors.append(f"08_EXTENSION_SYSTEM.md missing keywords: {missing}")

# Check 10: Runtime
doc_path = os.path.join(SYS_DIR, '09_LOCAL_RUNTIME.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["venv", "sys.path", "runtime_id", "mapped_storage"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["10. Local Runtime (09_LOCAL_RUNTIME)"] = "FAIL"
        errors.append(f"09_LOCAL_RUNTIME.md missing keywords: {missing}")

# Check 11: Config
doc_path = os.path.join(SYS_DIR, '10_CONFIGURATION_SYSTEM.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["DeveloperConfig", "sqlite_path", "posts_directory"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["11. Config System Spec (10_CONFIGURATION_SYSTEM)"] = "FAIL"
        errors.append(f"10_CONFIGURATION_SYSTEM.md missing keywords: {missing}")

# Check 12: Debug
doc_path = os.path.join(SYS_DIR, '11_DEBUGGING_SYSTEM.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Virtual Breakpoints", "trace_step", "YMLabTracer"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["12. Debugging Spec (11_DEBUGGING_SYSTEM)"] = "FAIL"
        errors.append(f"11_DEBUGGING_SYSTEM.md missing keywords: {missing}")

# Check 13: Logging
doc_path = os.path.join(SYS_DIR, '12_LOGGING_FRAMEWORK.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["StreamHandler", "RotatingFileHandler", "get_ymlab_logger"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["13. Logging Framework (12_LOGGING_FRAMEWORK)"] = "FAIL"
        errors.append(f"12_LOGGING_FRAMEWORK.md missing keywords: {missing}")

# Check 14: Testing
doc_path = os.path.join(SYS_DIR, '13_TESTING_FRAMEWORK.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Unit Test", "Integration Test", "verify_product.py", "run_self_verification"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["14. Testing Framework (13_TESTING_FRAMEWORK)"] = "FAIL"
        errors.append(f"13_TESTING_FRAMEWORK.md missing keywords: {missing}")

# Check 15: Mock
doc_path = os.path.join(SYS_DIR, '14_MOCK_SERVER.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["catalog_mock.db", "Mock DB", "mock_responses"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["15. Mock Server (14_MOCK_SERVER)"] = "FAIL"
        errors.append(f"14_MOCK_SERVER.md missing keywords: {missing}")

# Check 16: Simulator
doc_path = os.path.join(SYS_DIR, '15_API_SIMULATOR.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["intercept_enabled", "latency_seconds", "api_simulator"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["16. API Simulator (15_API_SIMULATOR)"] = "FAIL"
        errors.append(f"15_API_SIMULATOR.md missing keywords: {missing}")

# Check 17: Package Manager
doc_path = os.path.join(SYS_DIR, '16_PACKAGE_MANAGER.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["platform_libs/", "pyproject.toml", "dependency_lock"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["17. Package Manager (16_PACKAGE_MANAGER)"] = "FAIL"
        errors.append(f"16_PACKAGE_MANAGER.md missing keywords: {missing}")

# Check 18: Version Manager
doc_path = os.path.join(SYS_DIR, '17_VERSION_MANAGER.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Semantic Versioning", "Git Tagging", "version_history"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["18. Version Manager (17_VERSION_MANAGER)"] = "FAIL"
        errors.append(f"17_VERSION_MANAGER.md missing keywords: {missing}")

# Check 19: Build
doc_path = os.path.join(SYS_DIR, '18_BUILD_PIPELINE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["ymlab-cli package", "Clean", "build_job_id"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["19. Build Pipeline (18_BUILD_PIPELINE)"] = "FAIL"
        errors.append(f"18_BUILD_PIPELINE.md missing keywords: {missing}")

# Check 20: Dev Container
doc_path = os.path.join(SYS_DIR, '19_DEV_CONTAINER.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["devcontainer.json", "extensions", "forwardPorts"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["20. Dev Container (19_DEV_CONTAINER)"] = "FAIL"
        errors.append(f"19_DEV_CONTAINER.md missing keywords: {missing}")

# Check 21: Docker
doc_path = os.path.join(SYS_DIR, '20_DOCKER_ENVIRONMENT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["builder", "alpine", "docker-compose", "EXPOSE"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["21. Docker Environment (20_DOCKER_ENVIRONMENT)"] = "FAIL"
        errors.append(f"20_DOCKER_ENVIRONMENT.md missing keywords: {missing}")

# Check 22: Code Style
doc_path = os.path.join(SYS_DIR, '21_CODE_STYLE_GUIDE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["snake_case", "PascalCase", "Ruff", "mypy"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["22. Code Style Guide (21_CODE_STYLE_GUIDE)"] = "FAIL"
        errors.append(f"21_CODE_STYLE_GUIDE.md missing keywords: {missing}")

# Check 23: Structure Guide
doc_path = os.path.join(SYS_DIR, '22_PROJECT_STRUCTURE_GUIDE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["run.py", "config.json", "verify_product.py", "gitignore"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["23. Structure Guide (22_PROJECT_STRUCTURE_GUIDE)"] = "FAIL"
        errors.append(f"22_PROJECT_STRUCTURE_GUIDE.md missing keywords: {missing}")

# Check 24: Sample
doc_path = os.path.join(SYS_DIR, '23_SAMPLE_PROJECT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["sample_kimchi_service", "MockArticleAgent", "SafeDBConnector"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["24. Sample Project Spec (23_SAMPLE_PROJECT)"] = "FAIL"
        errors.append(f"23_SAMPLE_PROJECT.md missing keywords: {missing}")

# Check 25: Documentation
doc_path = os.path.join(SYS_DIR, '24_DEVELOPER_DOCUMENTATION.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Google Style Docstring", "Sphinx", "Swagger"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["25. Documentation Spec (24_DEVELOPER_DOCUMENTATION)"] = "FAIL"
        errors.append(f"24_DEVELOPER_DOCUMENTATION.md missing keywords: {missing}")

# Check 26: Validation
doc_path = os.path.join(SYS_DIR, '25_VALIDATION_SYSTEM.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["developer_platform_validation_run_id", "naming_convention", "cli_validation"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["26. Validation Spec (25_VALIDATION_SYSTEM)"] = "FAIL"
        errors.append(f"25_VALIDATION_SYSTEM.md missing keywords: {missing}")

# Check 27: Self Review
doc_path = os.path.join(SYS_DIR, '26_SELF_REVIEW.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Architecture & Design Consistency", "Development Framework Compliance"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["27. Self Review Check (26_SELF_REVIEW)"] = "FAIL"
        errors.append(f"26_SELF_REVIEW.md missing keywords: {missing}")

# Check 28: Completion Report
doc_path = os.path.join(SYS_DIR, '27_PHASE20_COMPLETION_REPORT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Phase 20 (AI Developer Platform) is Closed & Frozen.", "Deliverables List", "SELF_REVIEW"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["28. Final Completion Report (27_PHASE20_COMPLETION_REPORT)"] = "FAIL"
        errors.append(f"27_PHASE20_COMPLETION_REPORT.md missing keywords: {missing}")

# Print check list
for check_name, status in results.items():
    print(f"[{status}] {check_name}")

print("\n----------------------------------------")
all_pass = all(v == "PASS" for v in results.values())
if all_pass:
    print("  VERIFICATION RESULT: ALL CHECKS PASSED (VERIFIED)")
    print("----------------------------------------")
    print("[PASS] YM-LAB AI Developer Platform : Closed & Frozen")
    sys.exit(0)
else:
    print("  VERIFICATION RESULT: FAILURES DETECTED")
    print("----------------------------------------")
    for err in errors:
        print(f" - {err}")
    sys.exit(1)
