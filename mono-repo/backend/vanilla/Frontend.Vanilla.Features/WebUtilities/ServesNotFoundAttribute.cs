using System;

namespace Frontend.Vanilla.Features.WebUtilities;

/// <summary>Indicates this controller action serves not found route.</summary>
[AttributeUsage(AttributeTargets.Method)]
internal sealed class ServesNotFoundAttribute : Attribute { }
