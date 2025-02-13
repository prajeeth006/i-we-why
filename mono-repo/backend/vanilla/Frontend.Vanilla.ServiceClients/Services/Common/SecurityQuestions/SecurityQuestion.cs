using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Common.SecurityQuestions;

public sealed class SecurityQuestion(string id = null, string question = null)
{
    public string Id { get; } = id;
    public string Question { get; } = question;
}

internal sealed class SecurityQuestionResponse : IPosApiResponse<IReadOnlyList<SecurityQuestion>>
{
    public SecurityQuestion[] SecurityQuestions { get; set; }
    public IReadOnlyList<SecurityQuestion> GetData() => SecurityQuestions.AsReadOnly();
}
