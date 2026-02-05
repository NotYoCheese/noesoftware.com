---
title: "iab_forge: Multi-Label Content Categorization at Scale"
description: "Building an autonomous data pipeline and DeBERTa classifier covering all 698 IAB 2.2 taxonomy categories"
pubDate: "2024-09-15"
tags: ["NLP", "Transformers", "LangGraph", "Claude API", "DeBERTa"]
status: "mvp"
---

## The Challenge

The IAB Content Taxonomy 2.2 defines **698 categories** for classifying web content — from "Artificial Intelligence" to "Zoos & Aquariums." Existing classifiers cover only a fraction of these categories, leaving advertisers and publishers with incomplete content signals for contextual targeting.

The goal: build a multi-label classifier that covers **all 698 categories** with production-quality accuracy.

## The Approach

### Autonomous Data Collection Agent

Traditional approaches rely on Common Crawl, but its coverage of niche IAB categories is sparse. Instead, I built a **LangGraph autonomous agent** that:

- Analyzes which categories are underrepresented in the training set
- Crafts targeted web searches via the **Brave Search API** to find content for those categories
- Scrapes, cleans, and validates the content
- Labels pages using **Claude API** with few-shot prompting
- Iterates until coverage targets are met

This replaced months of manual data collection with an automated pipeline that ran continuously, cost-optimized with batched API calls.

### Claude-Powered Labeling Pipeline

Each scraped page flows through a labeling pipeline:

1. **Content extraction** — strip boilerplate, ads, navigation
2. **Claude few-shot labeling** — structured prompts with category definitions and examples
3. **Confidence scoring** — flag low-confidence labels for manual review
4. **Quality validation** — cross-reference labels against category definitions

### Model Architecture

The classifier uses **DeBERTa-v3-large** with:

- Multi-label classification head (698 outputs)
- **Focal Loss** to handle extreme class imbalance
- Stratified sampling to ensure minority categories appear in training batches
- Deployed via **FastAPI** for real-time inference, **SageMaker** for batch processing

## Results

| Metric | Value |
|--------|-------|
| Categories covered | 543+ of 698 |
| Labeled training pages | 20,243 |
| F1 score progression | 0.0015 → 0.66 |
| Classification speed | <100ms per page |

## Tech Stack

- **Model**: DeBERTa-v3-large (Hugging Face Transformers)
- **Data Agent**: LangGraph, Brave Search API
- **Labeling**: Claude API (few-shot prompting)
- **Training**: PyTorch, Focal Loss, stratified sampling
- **Serving**: FastAPI (real-time), SageMaker (batch)
- **Infrastructure**: Python, asyncio, PostgreSQL

## Status

MVP complete with full pipeline working end-to-end. The project demonstrated that an LLM-augmented data pipeline could achieve broad taxonomy coverage that traditional approaches couldn't match. Development was halted before production deployment due to company restructuring.
