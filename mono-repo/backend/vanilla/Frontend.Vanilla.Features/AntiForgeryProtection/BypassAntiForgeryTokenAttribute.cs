using System;

namespace Frontend.Vanilla.Features.AntiForgeryProtection;

/// <summary>
/// Used to explicitly exclude an action method from anti forgery measures.
/// </summary>
public sealed class BypassAntiForgeryTokenAttribute : Attribute { }
