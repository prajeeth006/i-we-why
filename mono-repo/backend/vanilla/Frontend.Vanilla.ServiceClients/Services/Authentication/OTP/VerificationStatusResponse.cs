using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Authentication.OTP;

internal sealed class VerificationStatusResponse : IPosApiResponse<IReadOnlyDictionary<string, string>>
{
    public IReadOnlyDictionary<string, string> Status { get; set; }

    public IReadOnlyDictionary<string, string> GetData()
    {
        return Status;
    }
}
