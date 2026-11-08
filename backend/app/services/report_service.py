import os
import io
import logging
from fpdf import FPDF
from datetime import datetime
from typing import Optional, List, Dict, Any
from backend.app.schemas.analysis import AnalysisJob

logger = logging.getLogger(__name__)

class IdeaScorePDFReport(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=15)

    def header(self):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, "IdeaScore AI -- Startup Validation & Investment Research Terminal", border=0, align="L")
        self.cell(0, 8, datetime.utcnow().strftime("%B %d, %Y"), border=0, align="R")
        self.ln(10)
        self.set_draw_color(220, 220, 220)
        self.line(10, 20, 200, 20)
        self.ln(3)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(160, 160, 160)
        self.cell(0, 10, f"Confidential Venture Research Report | Page {self.page_no()}", align="C")

class ReportService:
    @staticmethod
    def generate_pdf(job: AnalysisJob) -> bytes:
        pdf = IdeaScorePDFReport()
        pdf.add_page()

        # Title & Branding
        pdf.set_font("Helvetica", "B", 24)
        pdf.set_text_color(16, 24, 32)
        pdf.cell(0, 12, "IdeaScore AI Validation Report", ln=True)

        pdf.set_font("Helvetica", "I", 11)
        pdf.set_text_color(16, 185, 129) # neon green accent
        pdf.cell(0, 7, "Don't Just Build Ideas. Validate Them.", ln=True)
        pdf.ln(5)

        # 1. Executive Summary & Problem Overview
        pdf.set_fill_color(245, 247, 250)
        pdf.rect(10, pdf.get_y(), 190, 36, "F")
        pdf.set_xy(14, pdf.get_y() + 3)
        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(20, 30, 45)
        pdf.cell(0, 6, "1. PROBLEM OVERVIEW", ln=True)
        
        pdf.set_x(14)
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(60, 70, 80)
        raw_prob = job.problem_input.problem_text[:280] + ("..." if len(job.problem_input.problem_text) > 280 else "")
        pdf.multi_cell(182, 5, f"Submitted Problem: \"{raw_prob}\"")

        if job.problem_understanding:
            pdf.set_x(14)
            pdf.set_font("Helvetica", "B", 9)
            pdf.cell(32, 5, "Domain & Users:", ln=False)
            pdf.set_font("Helvetica", "", 9)
            pdf.cell(0, 5, f"{job.problem_understanding.industry_domain} | {', '.join(job.problem_understanding.target_user_groups[:2])}", ln=True)
        pdf.ln(8)

        # 2. Ranked Solutions Summary
        pdf.set_font("Helvetica", "B", 14)
        pdf.set_text_color(20, 30, 45)
        pdf.cell(0, 8, "2. GENERATED SOLUTIONS & RANKINGS", ln=True)
        pdf.ln(2)

        pdf.set_font("Helvetica", "B", 9)
        pdf.set_fill_color(230, 235, 245)
        pdf.cell(15, 7, "Rank", border=1, fill=True, align="C")
        pdf.cell(60, 7, "Solution Name", border=1, fill=True)
        pdf.cell(30, 7, "Weighted Score", border=1, fill=True, align="C")
        pdf.cell(40, 7, "Confidence", border=1, fill=True, align="C")
        pdf.cell(45, 7, "Primary Model", border=1, fill=True)
        pdf.ln()

        pdf.set_font("Helvetica", "", 9)
        for r in job.rankings[:5]:
            pdf.cell(15, 7, f"#{r.rank}", border=1, align="C")
            pdf.cell(60, 7, r.solution.name[:28], border=1)
            pdf.set_text_color(16, 150, 100)
            pdf.set_font("Helvetica", "B", 9)
            pdf.cell(30, 7, f"{r.score}/100", border=1, align="C")
            pdf.set_text_color(60, 70, 80)
            pdf.set_font("Helvetica", "", 9)
            pdf.cell(40, 7, r.confidence_level, border=1, align="C")
            pdf.cell(45, 7, r.solution.possible_revenue_model[:22], border=1)
            pdf.ln()

        pdf.ln(8)

        # 3. Top Solution In-Depth Breakdown
        if job.rankings:
            top = job.rankings[0]
            pdf.set_font("Helvetica", "B", 13)
            pdf.cell(0, 8, f"3. TOP RECOMMENDED SOLUTION: {top.solution.name.upper()} (Score: {top.score}/100)", ln=True)
            pdf.set_font("Helvetica", "", 9)
            pdf.multi_cell(190, 5, f"Description: {top.solution.short_description}")
            pdf.ln(2)
            pdf.set_font("Helvetica", "B", 9)
            pdf.cell(0, 5, f"Unique Value Proposition: {top.solution.unique_value_proposition}", ln=True)
            pdf.ln(2)

            # Evaluation Factor Table
            pdf.cell(0, 6, "Deterministic Evaluation Factors (0 - 100):", ln=True)
            f_scores = top.evaluation.factor_scores
            factors = [
                ("Problem Significance (15%)", f_scores.problem_significance),
                ("Market Potential (15%)", f_scores.market_potential),
                ("Innovation (15%)", f_scores.innovation),
                ("Technical Feasibility (15%)", f_scores.technical_feasibility),
                ("Scalability (10%)", f_scores.scalability),
                ("Revenue Potential (15%)", f_scores.revenue_potential),
                ("Competitive Positioning (10%)", f_scores.competitive_positioning),
                ("Social Impact (5%)", f_scores.social_impact)
            ]
            pdf.set_font("Helvetica", "", 8)
            for factor_title, score_val in factors:
                pdf.cell(80, 5, factor_title, border=1)
                pdf.cell(30, 5, f"{score_val:.1f} / 100", border=1, align="C")
                pdf.ln()

            pdf.ln(6)

        # 4. TinyFish Market Research Evidence
        pdf.set_font("Helvetica", "B", 13)
        pdf.cell(0, 8, "4. TINYFISH MARKET INTELLIGENCE & CITATIONS", ln=True)
        pdf.set_font("Helvetica", "", 9)
        
        all_evidence = []
        for r in job.research_data.values():
            all_evidence.extend(r.evidence_list)

        if all_evidence:
            for ev in all_evidence[:5]:
                pdf.set_font("Helvetica", "B", 9)
                pdf.set_text_color(20, 50, 100)
                pdf.cell(0, 5, f"Source: {ev.source_title} ({ev.site_name})", ln=True)
                pdf.set_font("Helvetica", "", 8)
                pdf.set_text_color(80, 80, 80)
                pdf.cell(0, 4, f"URL: {ev.source_url} | Category: {ev.evidence_category.upper()}", ln=True)
                pdf.multi_cell(190, 4, f"Extracted Evidence: {ev.extracted_information[:200]}...")
                pdf.ln(2)
        else:
            pdf.cell(0, 5, "No external evidence citations recorded.", ln=True)

        pdf.ln(4)

        # 5. Final Recommendation
        if job.final_recommendation:
            pdf.set_font("Helvetica", "B", 13)
            pdf.set_text_color(20, 30, 45)
            pdf.cell(0, 8, "5. VENTURE ADVISORY RECOMMENDATION", ln=True)
            pdf.set_font("Helvetica", "B", 9)
            pdf.cell(0, 5, "Why It Ranks First:", ln=True)
            pdf.set_font("Helvetica", "", 9)
            pdf.multi_cell(190, 5, job.final_recommendation.why_it_ranks_first)
            pdf.ln(2)
            pdf.set_font("Helvetica", "B", 9)
            pdf.cell(0, 5, "Recommended Next Step:", ln=True)
            pdf.set_font("Helvetica", "", 9)
            pdf.multi_cell(190, 5, job.final_recommendation.recommended_next_step)

        buffer = io.BytesIO()
        pdf.output(buffer)
        return buffer.getvalue()

report_service = ReportService()

