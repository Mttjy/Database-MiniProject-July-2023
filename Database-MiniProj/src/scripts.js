function dismissModal(modalId) {
    $('#' + modalId).modal('hide');
}

function toggleEditingForm(postId) {
    $('#editModal_' + postId).modal('toggle');
}

function toggleDeleteConfirmation(postId) {
    $('#editModal_' + postId).modal('hide');
    $('#deleteConfirmationModal_' + postId).modal('show');
}

function saveEditedPost(postId) {
    const editedTitle = $('#editTitle_' + postId).val();
    const editedSubTitle = $('#editSubTitle_' + postId).val();
    const editedDesc = $('#editPostDesc_' + postId).val();

    console.log("postId:", postId);
    console.log("editedTitle:", editedTitle);
    console.log("editedSubTitle:", editedSubTitle);
    console.log("editedDesc:", editedDesc);

    if (!editedTitle || !editedSubTitle || !editedDesc) {
        alert("All fields are required. Please fill in all the fields before saving.");
        return; // Stop further execution of the function
    }

    const postData = {
        post_id: postId,
        post_title: editedTitle,
        post_sub_title: editedSubTitle,
        post_desc: editedDesc,
    };

    $.ajax({
        url: '/author/update-post',
        type: 'POST',
        data: JSON.stringify(postData),
        contentType: 'application/json',
        success: function (response) {
            console.log('Post updated successfully:', response);
            toggleEditingForm(postId);
            location.reload();
        },
        error: function (err) {
            console.error('Error updating post:', err);
        },
    });
}

function publishPost(postId) {
    const editedTitle = $('#editTitle_' + postId).val();
    const editedSubTitle = $('#editSubTitle_' + postId).val();
    const editedDesc = $('#editPostDesc_' + postId).val();

    console.log("postId:", postId);
    console.log("editedTitle:", editedTitle);
    console.log("editedSubTitle:", editedSubTitle);
    console.log("editedDesc:", editedDesc);

    // Check if any field is empty (null, undefined, or empty string)
    if (!editedTitle || !editedSubTitle || !editedDesc) {
        alert("All fields are required. Please fill in all the fields before saving.");
        return; // Stop further execution of the function
    }

    const postData = {
        post_id: postId,
        post_title: editedTitle,
        post_sub_title: editedSubTitle,
        post_desc: editedDesc,
    };

    $.ajax({
        url: '/author/toPublish',
        type: 'POST',
        data: JSON.stringify(postData),
        contentType: 'application/json',
        success: function (response) {
            console.log('Post updated successfully:', response);
            toggleEditingForm(postId);
            location.reload();
        },
        error: function (err) {
            console.error('Error updating post:', err);
        },
    });
}

function deletePost(postId) {
    $.ajax({
        url: '/author/delete-post/' + postId,
        type: 'DELETE',
        success: function (response) {
            console.log('Post deleted successfully:', response);
            dismissModal('deleteConfirmationModal_' + postId);
            dismissModal('editModal_' + postId);
            location.reload();
        },
        error: function (xhr, status, error) {
            console.error('Error deleting post:', error);
            console.log('Server response:', xhr.responseText);
        },
    });
}

function openNewPostModal() {
    $('#addFormModal').modal('show');
}

function saveNewPost() {
    const postTitle = document.getElementById("addTitle").value;
    const postSubTitle = document.getElementById("addSubTitle").value;
    const postDesc = document.getElementById("addPostDesc").value;

    if (!postTitle || !postSubTitle || !postDesc) {
        alert("All fields are required. Please fill in all the fields before saving.");
        return;
    }

    const newPostData = {
        post_title: postTitle,
        post_sub_title: postSubTitle,
        post_desc: postDesc
    };

    $.ajax({
        type: "POST",
        url: "/author/newPost",
        data: JSON.stringify(newPostData),
        contentType: 'application/json',
        success: function (response) {
            console.log("New post saved successfully:", response);

            $("#addFormModal").modal("hide");

            location.reload();
        },
        error: function (error) {
            console.error("Error saving new post:", error);
        }
    });
}

$(document).ready(function () {
    $(".edit-button").unbind("click").on("click", function () {
        const postId = $(this).data("post-id");
        toggleEditingForm(postId);
    });
});