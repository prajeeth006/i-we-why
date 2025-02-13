using System;

namespace Frontend.Vanilla.Features.WebUtilities;

/// <summary>Indicates this controller action serves full HTML document so all related logic should be executed e.g. redirects, SEO, prerender.</summary>
[AttributeUsage(AttributeTargets.Method)]
internal sealed class ServesHtmlDocumentAttribute : Attribute { }
