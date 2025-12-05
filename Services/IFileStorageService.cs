using Microsoft.AspNetCore.Http;

namespace Second_hand_System.Services
{
    public interface IFileStorageService
    {
        Task<string> SaveFileAsync(IFormFile file, string folderName);
    }
}
