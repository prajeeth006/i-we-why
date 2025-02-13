// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;
using System.Reflection;

#pragma warning disable 659 // overrides AddToHashCodeCombiner instead
namespace Frontend.Vanilla.Core.Expressions;

// BinaryExpression fingerprint class
// Useful for things like array[index]
[SuppressMessage("ReSharper", "SX1101", Justification = "Pasted code")]
[SuppressMessage("ReSharper", "SA1512", Justification = "Pasted code")]
internal sealed class BinaryExpressionFingerprint(ExpressionType nodeType, Type type, MethodInfo method) : ExpressionFingerprint(nodeType, type)
{
    // Other properties on BinaryExpression (like IsLifted / IsLiftedToNull) are simply derived
    // from Type and NodeType, so they're not necessary for inclusion in the fingerprint.

    // http://msdn.microsoft.com/en-us/library/system.linq.expressions.binaryexpression.method.aspx
    public MethodInfo Method { get; private set; } = method;

    public override bool Equals(object? obj)
    {
        var other = obj as BinaryExpressionFingerprint;

        return (other != null)
               && Equals(this.Method, other.Method)
               && this.Equals(other);
    }

    internal override void AddToHashCodeCombiner(HashCodeCombiner combiner)
    {
        combiner.AddObject(Method);
        base.AddToHashCodeCombiner(combiner);
    }
}
