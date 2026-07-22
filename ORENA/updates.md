## ORENA-grand challenge
There are three different tracks in hte ORENA-grand challenge.
All tracks are based on 2 datasets.

1. Frame Track: 
    - This track is image QA on surgical frames.
    - Input: Frame + question in json
    - Output: Answer in json
    - Format: Docker Container
    - No internet access
    - 5 second time limit per question
    - External, but publicly available data is allowed
    - 40GB Vram single GPU
2. Segment Track:
    - Video QA on surgical segments
    - Time limit: 15 seconds
    - 80 GB Vram single GPU
    - Video length: 5 minutes
3. Procedure Track:
    - Video QA on surgical procedures
    - Time limit: 30 seconds
    - 80 GB Vram single GPU
    - Video length: 1+ hour

### What We Have Tried Doing
We are tackling frame track and procedure track for now. Below are what we did for frame and procedure.
#### Frame Track
## FRAME Track Results

Local exact-match proxy evaluation on 1,976 labeled FRAME test questions. These are not official hidden-test leaderboard results.

### Results by Task

| Task | Capability | Test Questions | Best Accuracy | Best Variant | Main Finding |
|---|---|---:|---:|---|---|
| Foreign-object recognition | `1a` | 966 | **73.6%** | Qwen3-VL-8B routed LoRA | LoRA and task-specific prompting substantially improved surgical object classification. |
| State and attribute recognition | `1c` | 43 | **51.2%** | Qwen3-VL-8B KB/balanced LoRA | A small surgical knowledge base helped attribute questions, but the subset is small. |
| Image-plane spatial localization | `1d` | 450 | **62.7%** | Qwen3-VL-8B routed high-resolution LoRA | Higher image resolution helped, although quadrant and directional errors remain. |
| Anatomy and situs localization | `1e` | 47 | **19.1%** | Qwen3-VL-8B RAG/soft-balanced LoRA | RAG improved anatomy questions, but this remains the weakest task. |
| Counting and aggregation | `3a` | 470 | **82.1%** | Qwen3-VL-8B routed LoRA | Counting is currently the strongest FRAME capability. |
| **Overall FRAME track** | — | **1,976** | **69.8%** | Qwen3-VL-8B routed high-resolution LoRA | Best general FRAME configuration so far. |

### Overall Experimental Progression

| Experiment | Model and Method | Correct | Total | Accuracy | Finding |
|---|---|---:|---:|---:|---|
| Zero-shot baseline | Qwen3-VL-2B, plain prompt | 388 | 1,976 | 19.6% | The base model performed poorly without task adaptation. |
| Static-vocabulary prompting | Qwen3-VL-2B | 642 | 1,976 | 32.5% | Constraining the answer vocabulary helped substantially. |
| Standard LoRA SFT | Qwen3-VL-2B | 1,290 | 1,976 | 65.3% | Fine-tuning produced the largest improvement. |
| Routed LoRA SFT | Qwen3-VL-2B | 1,346 | 1,976 | 68.1% | Task-specific prompt routing improved the LoRA baseline. |
| Routed LoRA SFT | Qwen3-VL-8B | 1,375 | 1,976 | 69.6% | Increasing model size produced a modest improvement. |
| Routed high-resolution LoRA | Qwen3-VL-8B | **1,380** | **1,976** | **69.8%** | Best general FRAME result. |
| KB and capability balancing | Qwen3-VL-8B | 1,379 | 1,976 | 69.8% | Improved attribute reasoning but remained flat overall. |
| RAG and soft balancing | Qwen3-VL-8B | 1,356 | 1,976 | 68.6% | Helped anatomy questions but reduced performance on common visual tasks. |