// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;

#pragma warning disable 659 // overrides AddToHashCodeCombiner instead
namespace Frontend.Vanilla.Core.Expressions;

// LambdaExpression fingerprint class
// Represents a lambda expression (root element in Expression<T>)
[SuppressMessage("Microsoft.Usage", "CA2218:OverrideGetHashCodeOnOverridingEquals", Justification = "Overrides AddToHashCodeCombiner() instead.")]
[SuppressMessage("ReSharper", "SX1101", Justification = "Pasted code")]
[SuppressMessage("ReSharper", "SA1512", Justification = "Pasted code")]
internal sealed class LambdaExpressionFingerprint(ExpressionType nodeType, Type type) : ExpressionFingerprint(nodeType, type)
{
    // There are no properties on LambdaExpression that are worth including in
    // the fingerprint.

    public override bool Equals(object? obj)
    {
        var other = obj as LambdaExpressionFingerprint;

        return (other != null)
               && this.Equals(other);
    }
}
