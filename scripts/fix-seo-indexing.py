#!/usr/bin/env python3
"""Compatibility wrapper — prefer scripts/build-seo.py."""
from pathlib import Path
import runpy

runpy.run_path(str(Path(__file__).with_name("build-seo.py")), run_name="__main__")
