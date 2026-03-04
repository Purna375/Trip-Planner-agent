@echo off
echo Compiling LaTeX document...
pdflatex -halt-on-error -interaction=batchmode DESIGN-DOCUMENT-WITH-DIAGRAMS.tex >nul 2>&1

if exist DESIGN-DOCUMENT-WITH-DIAGRAMS.pdf (
    echo SUCCESS: PDF created successfully!
    echo File: DESIGN-DOCUMENT-WITH-DIAGRAMS.pdf
) else (
    echo FAILED: Compilation error occurred
    echo Check DESIGN-DOCUMENT-WITH-DIAGRAMS.log for details
    findstr /C:"!" DESIGN-DOCUMENT-WITH-DIAGRAMS.log | findstr /V "%" | more
)
