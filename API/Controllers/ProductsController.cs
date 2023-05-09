using API.Dto;
using API.Errors;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specification;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{

	public class ProductsController : BaseApiController
	{
		IGenericRepository<ProductBrand> _productBandsRepo;
		IGenericRepository<Product> _productRepo;
		IGenericRepository<ProductType> _productType;

		public IMapper _mapper;

		public ProductsController(IGenericRepository<ProductBrand> productBandsRepo,
		IGenericRepository<Product> productRepo,
		IGenericRepository<ProductType> productType,
		IMapper mapper)
		{
			_productBandsRepo = productBandsRepo;
			_productRepo = productRepo;
			_productType = productType;
			_mapper = mapper;
		}

		[HttpGet]
		public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetProducts(string sort)
		{
			var spec = new ProductsWithTypesAndBrandsSpecification(sort);
            var products = await _productRepo.ListAsync(spec);
			return Ok(_mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products).ToList());
		}

		[HttpGet("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
		public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
		{
			var spec = new ProductsWithTypesAndBrandsSpecification(id);
			var product = await _productRepo.GetEntityWithSpec(spec);

			if (product == null) return NotFound(new ApiResponse(404));
			return _mapper.Map<Product, ProductToReturnDto>(product);
		}

		[HttpGet("brands")]
		public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
		{
			return Ok(await _productBandsRepo.ListAllAsync());
		}

		[HttpGet("types")]
		public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductTypes()
		{
			return Ok(await _productType.ListAllAsync());
		}
	}
}
