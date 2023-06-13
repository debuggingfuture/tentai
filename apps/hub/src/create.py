from huggingface_hub import (
    create_repo,
    get_full_repo_name,
    upload_file,
)
create_repo(name=target_space_name, token=hf_token, repo_type="space", space_sdk="gradio")
repo_name = get_full_repo_name(model_id=target_space_name, token=hf_token)
file_url = upload_file(
    path_or_fileobj="file.txt",
    path_in_repo="app.py",
    repo_id=repo_name,
    repo_type="space",
    token=hf_token,
)
