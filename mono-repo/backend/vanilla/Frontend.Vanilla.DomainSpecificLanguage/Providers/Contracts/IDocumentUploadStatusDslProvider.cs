using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides document upload status based on useCase for authenticated user.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description("Provides document upload status based on useCase for authenticated user.")]
public interface IDocumentUploadStatusDslProvider
{
    /// <summary>
    /// Indicates if user has already uploaded document with pending status.
    /// </summary>
    [Description("Indicates if user has already uploaded document with pending status")]
    Task<bool> IsPendingAsync(ExecutionMode mode, string useCase);

    /// <summary>
    /// Indicates uploaded document pending status.
    /// </summary>
    [Description("Indicates uploaded document pending status")]
    Task<string> PendingWithAsync(ExecutionMode mode, string useCase);
}
