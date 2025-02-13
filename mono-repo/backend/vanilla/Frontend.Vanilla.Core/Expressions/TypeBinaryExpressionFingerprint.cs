// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;

#pragma warning disable 659 // overrides AddToHashCodeCombiner instead
namespace Frontend.Vanilla.Core.Expressions;

// TypeBinary fingerprint class
// Expression of form "obj is T"
[SuppressMessage("Microsoft.Usage", "CA2218:OverrideGetHashCodeOnOverridingEquals", Justification = "Overrides AddToHashCodeCombiner() instead.")]
[SuppressMessage("ReSharper", "SX1101", Justification = "Pasted code")]
[SuppressMessage("ReSharper", "SA1512", Justification = "Pasted code")]
internal sealed class TypeBinaryExpressionFingerprint(ExpressionType nodeType, Type type, Type typeOperand) : ExpressionFingerprint(nodeType, type)
{
    // http://msdn.microsoft.com/en-us/library/system.linq.expressions.typebinaryexpression.typeoperand.aspx
    public Type TypeOperand { get; private set; } = typeOperand;

    public override bool Equals(object? obj)
    {
        var other = obj as TypeBinaryExpressionFingerprint;

        return (other != null)
               && Equals(this.TypeOperand, other.TypeOperand)
               && this.Equals(other);
    }

    internal override void AddToHashCodeCombiner(HashCodeCombiner combiner)
    {
        combiner.AddObject(TypeOperand);
        base.AddToHashCodeCombiner(combiner);
    }
}
