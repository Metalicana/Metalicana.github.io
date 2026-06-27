# Memory is The New Bottleneck In Long Horizon Video Generation

## Video Generation
The video generation family of models has evolved into 3 categories.

**Diffusion Models** take a cube of noise, and some conditioning inputs, and denoise the whole thing.

**Autoregressive Models** generate a video frame by frame, conditioning on the previous frames. This is a sequential process, and the model has to remember all the previous frames in order to generate the next one.

**Hybrid Models** combine the two approaches, using a diffusion model to generate a short video, and then using the past frame's subset as conditioning for the next short video generation. This is not pure autoregressive, so the KV cache mechanism does not work here.

### How To Make Them Long Video Generators?
Answer: FORCING! 
Till now, Flow based, or regular diffusion models create the most aesthetically pleasing videos compared to other methods. Wan 2.2, CogVideoX, Seed Dance 2.0. They are all great at video generation. There is a full host of papers in the last few years solely focusing on the forcing part. But they perform the best on long video generation. It is still very much in its infancy, and there is lot of room for improvement.
### What Forcing Is There?


Forcing is making training or inference abide by some constraints. Examples include: Teacher forcing, self-forcing, memory forcing, cache forcing, etc. Here is a more detailed table:
| Idea | Meaning |
|---|---|
| Teacher forcing | Train with ground-truth history. Easy and stable during training, but mismatched with test-time rollout. |
| Exposure bias | The model trains on clean history but tests on its own imperfect generations, so errors accumulate. |
| Autoregressive forcing | Generate video sequentially, forcing each future frame/chunk to depend only on past context. |
| Diffusion forcing | Combine causal next-token prediction with diffusion by assigning different noise levels to different frames/tokens. |
| Self forcing | Train the model using its own generated history so it learns to survive its own mistakes. |
| Causal forcing | Make the teacher/student or distillation process obey causal autoregressive constraints. |
| Rolling forcing | Denoise a moving temporal window so each step sees recent generated context while rolling forward. |
| Direct forcing | Explicitly force long-video generation to condition on selected memory/context instead of only the latest frames. |
| **Memory forcing** | Force the model to use structured past memory, especially when revisiting earlier scenes or objects. |
| Cache forcing | Control which historical tokens, frames, or KV states remain available during long autoregressive rollout. |

### How Is Memory Forcing Different From World Models?
Memory forcing or any kind of forcing is just a way to add more explicit guardrails to make a video generation model generate what we want it to generate. 

*If our conditioning guardrails are memory, then we are doing memory forcing.* If we are guard railing with actions, we are doing action forcing. How should the video generation happen based on the given memory, and input? That is fundamentally different from what a world model is doing. 

A world model learns the dynamics of a world, and then uses that learned dynamics to generate future frames. Memory forcing is more about controlling the generation process to ensure consistency and adherence to past context. World model is implicit forcing basically. 

And video generations have lots of explicit forcing. **This strongly suggests, video generation models inherently are NOT future predictors**. There is no dynamics learned. There is no reasoning, there is no prediction. Only a video generator is now being controlled very well by us.

Here is an AI generated picture highlighting what I mean.

![World model vs forced video generation](wd.png)

## Literature
First let's list out some of the prominent papers regarding the intersection of standard diffusion models adapted to long video generation with a memory bank.
### Venues

#### CVPR 2025
1. [A Consecutive Events-Based Benchmark for Future Long Video Generation](https://openaccess.thecvf.com/content/CVPR2025/papers/Wang_Is_Your_World_Simulator_a_Good_Story_Presenter_A_Consecutive_CVPR_2025_paper.pdf)  [Microsoft]
2. [StreamingT2V](https://openaccess.thecvf.com/content/CVPR2025/papers/Henschel_StreamingT2V_Consistent_Dynamic_and_Extendable_Long_Video_Generation_from_Text_CVPR_2025_paper.pdf) [Georgia Tech]
3. [LongDiff](https://openaccess.thecvf.com/content/CVPR2025/papers/Li_LongDiff_Training-Free_Long_Video_Generation_in_One_Go_CVPR_2025_paper.pdf) [Monash]
4. [Movie Bench](https://openaccess.thecvf.com/content/CVPR2025/papers/Wu_MovieBench_A_Hierarchical_Movie_Level_Dataset_for_Long_Video_Generation_CVPR_2025_paper.pdf) [NUS]
5. [Free PCA](https://openaccess.thecvf.com/content/CVPR2025/papers/Tan_FreePCA_Integrating_Consistency_Information_across_Long-short_Frames_in_Training-free_Long_CVPR_2025_paper.pdf) [USTC]

#### ICCV 2025
1. [**VMem**](https://openaccess.thecvf.com/content/ICCV2025/papers/Li_VMem_Consistent_Interactive_Video_Scene_Generation_with_Surfel-Indexed_View_Memory_ICCV_2025_paper.pdf) [Oxford]
2. [TokensGen](https://openaccess.thecvf.com/content/ICCV2025/papers/Ouyang_TokensGen_Harnessing_Condensed_Tokens_for_Long_Video_Generation_ICCV_2025_paper.pdf) [Peking University]
3. [Long Animation](https://openaccess.thecvf.com/content/ICCV2025/papers/Chen_LongAnimation_Long_Animation_Generation_with_Dynamic_Global-Local_Memory_ICCV_2025_paper.pdf) [HKUST]
4. [Long-Context State-Space Video World Models](https://openaccess.thecvf.com/content/ICCV2025/papers/Zhang_Long-Context_State-Space_Video_World_Models_ICCV_2025_paper.pdf) [Adobe]

#### NeurIPS 2025
1. [**WorldMem**](https://openreview.net/pdf?id=c6CAVKlKmU) [Peking University]
2. [**SPMem**](https://spmem.github.io/)  [Stanford]
3. [**VRAG**](https://sites.google.com/view/vrag/home) [Princeton]
4. [AntiForgetting](https://proceedings.neurips.cc/paper_files/paper/2025/file/2bde8fef08f7ebe42b584266cbcfc909-Paper-Conference.pdf) [MIT]
5. [EDELINE](https://openreview.net/pdf?id=ph1V6n7BSv) [NVIDIA]

#### ICLR 2026
1. [Mixture of Contexts](https://openreview.net/forum?id=y6XJZlEC2x) [Stanford]
2. [**LongLive**](https://openreview.net/forum?id=nCAODkpsPJ) [NVIDIA]
3. [Rolling Forcing](https://openreview.net/forum?id=IAyzXjbfwo) [Tencent ARC]
4. [FlowCache](https://openreview.net/forum?id=vko4DuhKbh) [ByteDance]
5. [Stable Video Infinity](https://openreview.net/forum?id=X96Ei9n34a) [EPFL]

#### CVPR 2026
1. [**Captain Safari**](https://openaccess.thecvf.com/content/CVPR2026/papers/Chou_Captain_Safari_A_World_Engine_with_Pose-Aligned_3D_Memory_CVPR_2026_paper.pdf) [Johns Hopkins University]
2. [**OneStory**](https://openaccess.thecvf.com/content/CVPR2026/papers/An_OneStory_Coherent_Multi-Shot_Video_Generation_with_Adaptive_Memory_CVPR_2026_paper.pdf) [Meta AI]
3. [**WorldStereo**](https://arxiv.org/abs/2603.02049) [Tencent Hunyuan]
4. [ARCache](https://openaccess.thecvf.com/content/CVPR2026/papers/Nan_Accelerating_Autoregressive_Video_Diffusion_via_History-Guided_Cache_and_Residual_Correction_CVPR_2026_paper.pdf) [Nanjing University]
5. [FreeLOC](https://openaccess.thecvf.com/content/CVPR2026/papers/Tian_Free-Lunch_Long_Video_Generation_via_Layer-Adaptive_O.O.D_Correction_CVPR_2026_paper.pdf) [Westlake University]

#### Active arXiv / Preprints
1. [Echo-Forcing](https://arxiv.org/abs/2605.16003) [CAS]
2. [**Echo-Memory**](https://arxiv.org/abs/2606.09803) [JD]
3. [**COVRAG**](https://arxiv.org/abs/2606.02479) [KAIST]
4. [SlotMemory](https://arxiv.org/abs/2605.31033) [Fudan University]
5. [**LongLive-RAG**](https://arxiv.org/abs/2606.02553) [NVIDIA]
6. [DySink](https://arxiv.org/abs/2605.21028) [Southeast University]
7. [MosaicMem](https://arxiv.org/abs/2603.17117) [University of Toronto]
8. [**Memory Forcing**](https://arxiv.org/abs/2510.03198) [CUHK Shenzhen]
9. [Memento](https://arxiv.org/abs/2606.14667) [Baidu]
10. [AnchorWeave](https://arxiv.org/abs/2602.14941) [UNC]
11. [VideoSSM](https://arxiv.org/abs/2512.04519) [HKU]
12. [FAR](https://arxiv.org/abs/2503.19325) [NUS]


### Detailed Literature Understanding
#### 1. VMem: Consistent Interactive Video Scene Generation with Surfel-Indexed View Memory
- **Authors**: Li et al., ICCV 2025 Oxford Visual Geometry Group

- **Summary**: VMem introduces a surfel-indexed view memory to maintain consistency in long video generation.




